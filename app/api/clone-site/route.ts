import { NextRequest, NextResponse } from 'next/server';
import { jobsStore } from '../lib/jobs-store';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import * as cheerio from 'cheerio';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

function generateJobId(): string {
  return `job_${Date.now()}_${Math.random().toString(36).substring(7)}`;
}

function generateSubdomain(url: string): string {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.replace(/^www\./, '').replace(/\./g, '-');
    return `${hostname}-${Date.now()}`;
  } catch {
    return `site-${Date.now()}`;
  }
}

function isValidUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    // Validazione URL
    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { error: 'URL mancante o non valido' },
        { status: 400 }
      );
    }

    if (!isValidUrl(url)) {
      return NextResponse.json(
        { error: 'Formato URL non valido' },
        { status: 400 }
      );
    }

    // Genera ID job e subdomain
    const jobId = generateJobId();
    const subdomain = generateSubdomain(url);

    // Salva job iniziale
    jobsStore.set(jobId, {
      status: 'processing',
      subdomain,
      createdAt: new Date()
    });

    // Simula processo di cloning asincrono
    // In produzione, questo dovrebbe essere un background job/worker
    simulateCloning(jobId, url, subdomain);

    return NextResponse.json({
      jobId,
      subdomain: subdomain,
      status: 'processing',
      estimatedTime: '5-15 minuti'
    });

  } catch (error) {
    console.error('Errore clone-site:', error);
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    );
  }
}

// Cloning reale del sito
async function simulateCloning(jobId: string, originalUrl: string, subdomain: string) {
  let browser;

  try {
    console.log(`🚀 Inizio cloning: ${originalUrl}`);

    // 1. Avvia Puppeteer con Chromium serverless
    const isProduction = process.env.NODE_ENV === 'production';

    browser = await puppeteer.launch({
      args: isProduction ? chromium.args : ['--no-sandbox', '--disable-setuid-sandbox'],
      defaultViewport: { width: 1920, height: 1080 },
      executablePath: isProduction
        ? await chromium.executablePath()
        : process.platform === 'win32'
          ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
          : process.platform === 'darwin'
            ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
            : '/usr/bin/google-chrome',
      headless: true
    });

    const page = await browser.newPage();

    // 2. Naviga al sito
    console.log(`📡 Navigazione a ${originalUrl}...`);
    await page.goto(originalUrl, {
      waitUntil: 'domcontentloaded', // Più veloce di networkidle0
      timeout: 60000 // 60 secondi
    }).catch(async (error) => {
      // Fallback: prova con load se domcontentloaded fallisce
      console.warn('⚠️ domcontentloaded fallito, provo con load...');
      await page.goto(originalUrl, {
        waitUntil: 'load',
        timeout: 60000
      });
    });

    // 3. Estrai HTML homepage
    const html = await page.content();
    const $ = cheerio.load(html);

    // 3.5. Trova tutte le sottopagine da clonare
    console.log(`🔍 Ricerca sottopagine...`);
    const internalLinks: string[] = [];
    const baseUrlObj = new URL(originalUrl);
    const clonedPages: Array<{title: string; url: string; filename: string}> = [];

    $('a[href]').each((i, el) => {
      const href = $(el).attr('href');
      if (href && !href.startsWith('#') && !href.startsWith('mailto:') && !href.startsWith('tel:')) {
        try {
          const fullUrl = new URL(href, originalUrl);
          // Solo link dello stesso dominio
          if (fullUrl.hostname === baseUrlObj.hostname && fullUrl.pathname !== baseUrlObj.pathname) {
            if (!internalLinks.includes(fullUrl.href)) {
              internalLinks.push(fullUrl.href);
            }
          }
        } catch (e) {
          // Ignora URL invalidi
        }
      }
    });

    // Limita a max 20 pagine per performance
    const pagesToClone = internalLinks.slice(0, 20);
    console.log(`📄 Trovate ${internalLinks.length} sottopagine, clono le prime ${pagesToClone.length}`);

    // 3.7. Crea mappa URL originale → file locale per i link interni
    const urlToLocalFile = new Map<string, string>();
    urlToLocalFile.set(originalUrl, `/cloned-sites/${subdomain}/index.html`);
    urlToLocalFile.set(baseUrlObj.origin + baseUrlObj.pathname, `/cloned-sites/${subdomain}/index.html`);

    pagesToClone.forEach(pageUrl => {
      const pagePath = new URL(pageUrl).pathname;
      const safePath = pagePath.replace(/\//g, '_').replace(/[^a-zA-Z0-9_-]/g, '') || 'page';
      const filename = `${safePath}.html`;
      urlToLocalFile.set(pageUrl, `/cloned-sites/${subdomain}/${filename}`);
    });

    console.log(`🗺️ Mappa link creata: ${urlToLocalFile.size} pagine`);

    // 4. Directory per salvare i file
    const publicDir = path.join(process.cwd(), 'public', 'cloned-sites', subdomain);
    const cssDir = path.join(publicDir, 'css');
    const jsDir = path.join(publicDir, 'js');
    const imgDir = path.join(publicDir, 'images');

    // Crea le directory
    [publicDir, cssDir, jsDir, imgDir].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });

    console.log(`📁 Directory create: ${publicDir}`);

    // 5. Scarica CSS
    console.log(`📥 Download CSS...`);
    const cssLinks: string[] = [];
    $('link[rel="stylesheet"]').each((i, el) => {
      const href = $(el).attr('href');
      if (href) {
        try {
          const fullUrl = new URL(href, originalUrl).href;
          cssLinks.push(fullUrl);
        } catch (e) {
          console.warn(`⚠️ CSS URL invalido: ${href}`);
        }
      }
    });

    for (let i = 0; i < Math.min(cssLinks.length, 10); i++) {
      try {
        const cssUrl = cssLinks[i];
        const response = await axios.get(cssUrl, { timeout: 10000 });
        const filename = `style-${i}.css`;
        fs.writeFileSync(path.join(cssDir, filename), response.data);
        console.log(`✅ CSS ${i + 1}/${cssLinks.length} scaricato`);
      } catch (error) {
        console.warn(`⚠️ CSS download fallito: ${cssLinks[i]}`);
      }
    }

    // 6. Scarica JS (primi 5 per velocità)
    console.log(`📥 Download JS...`);
    const jsLinks: string[] = [];
    $('script[src]').each((i, el) => {
      const src = $(el).attr('src');
      if (src && !src.startsWith('data:')) {
        try {
          const fullUrl = new URL(src, originalUrl).href;
          jsLinks.push(fullUrl);
        } catch (e) {
          console.warn(`⚠️ JS URL invalido: ${src}`);
        }
      }
    });

    for (let i = 0; i < Math.min(jsLinks.length, 5); i++) {
      try {
        const jsUrl = jsLinks[i];
        const response = await axios.get(jsUrl, { timeout: 10000 });
        const filename = `script-${i}.js`;
        fs.writeFileSync(path.join(jsDir, filename), response.data);
        console.log(`✅ JS ${i + 1}/${jsLinks.length} scaricato`);
      } catch (error) {
        console.warn(`⚠️ JS download fallito: ${jsLinks[i]}`);
      }
    }

    // 7. Scarica immagini (prime 10 per velocità)
    console.log(`📥 Download immagini...`);
    const imgLinks: string[] = [];
    $('img[src]').each((i, el) => {
      const src = $(el).attr('src');
      if (src && !src.startsWith('data:')) {
        try {
          const fullUrl = new URL(src, originalUrl).href;
          imgLinks.push(fullUrl);
        } catch (e) {
          console.warn(`⚠️ IMG URL invalido: ${src}`);
        }
      }
    });

    for (let i = 0; i < Math.min(imgLinks.length, 10); i++) {
      try {
        const imgUrl = imgLinks[i];
        const response = await axios.get(imgUrl, {
          responseType: 'arraybuffer',
          timeout: 10000
        });
        const ext = path.extname(new URL(imgUrl).pathname) || '.jpg';
        const filename = `image-${i}${ext}`;
        fs.writeFileSync(path.join(imgDir, filename), response.data);
        console.log(`✅ IMG ${i + 1}/${imgLinks.length} scaricato`);
      } catch (error) {
        console.warn(`⚠️ IMG download fallito: ${imgLinks[i]}`);
      }
    }

    // 8. Modifica HTML per puntare ai file locali
    console.log(`🔧 Aggiornamento HTML...`);
    $('link[rel="stylesheet"]').each((i, el) => {
      if (i < 10) {
        $(el).attr('href', `/cloned-sites/${subdomain}/css/style-${i}.css`);
      }
    });

    $('script[src]').each((i, el) => {
      const src = $(el).attr('src');
      if (src && !src.startsWith('http') && i < 5) {
        $(el).attr('src', `/cloned-sites/${subdomain}/js/script-${i}.js`);
      }
    });

    $('img[src]').each((i, el) => {
      const src = $(el).attr('src');
      if (src && !src.startsWith('data:') && !src.startsWith('http') && i < 10) {
        const ext = path.extname(src) || '.jpg';
        $(el).attr('src', `/cloned-sites/${subdomain}/images/image-${i}${ext}`);
      }
    });

    // 8.5. Rimuovi credits "made by", "realized by", etc.
    console.log(`🧹 Rimozione credits...`);

    // Lista di pattern da cercare nel testo
    const creditsPatterns = [
      'made by', 'realized by', 'powered by', 'designed by',
      'developed by', 'created by', 'website by', 'built by',
      'realizzato da', 'progettato da', 'sviluppato da', 'creato da'
    ];

    // Cerca e rimuovi elementi contenenti questi pattern
    $('*').each((i, el) => {
      const text = $(el).text().toLowerCase();
      const hasCredits = creditsPatterns.some(pattern => text.includes(pattern));

      if (hasCredits) {
        // Rimuovi solo se l'elemento è piccolo (probabilmente un footer credit)
        if (text.length < 200) {
          console.log(`  🗑️ Rimosso: "${$(el).text().trim().substring(0, 50)}..."`);
          $(el).remove();
        }
      }
    });

    // Rimuovi elementi con classi/id comuni per credits
    const creditSelectors = [
      '.credits', '.copyright', '.author', '.designer', '.developer',
      '#credits', '#copyright', '#author', '#designer', '#developer',
      '[class*="credits"]', '[class*="copyright"]', '[class*="author"]',
      '[id*="credits"]', '[id*="copyright"]'
    ];

    creditSelectors.forEach(selector => {
      const elements = $(selector);
      if (elements.length > 0) {
        console.log(`  🗑️ Rimossi ${elements.length} elementi con selector: ${selector}`);
        elements.remove();
      }
    });

    // 8.6. Aggiorna link interni per puntare alle pagine clonate
    console.log(`🔗 Aggiornamento link interni...`);
    let linksUpdated = 0;

    $('a[href]').each((i, el) => {
      const href = $(el).attr('href');
      if (href && !href.startsWith('#') && !href.startsWith('mailto:') && !href.startsWith('tel:')) {
        try {
          const fullUrl = new URL(href, originalUrl).href;
          const localPath = urlToLocalFile.get(fullUrl);

          if (localPath) {
            $(el).attr('href', localPath);
            linksUpdated++;
          }
        } catch (e) {
          // Ignora URL invalidi
        }
      }
    });

    console.log(`  ✅ Aggiornati ${linksUpdated} link interni`);

    // 9. Salva HTML homepage
    const finalHtml = $.html();
    fs.writeFileSync(path.join(publicDir, 'index.html'), finalHtml);
    console.log(`💾 HTML homepage salvato`);

    // Aggiungi homepage all'array delle pagine
    const homeTitle = $('title').text() || 'Homepage';
    clonedPages.push({
      title: homeTitle,
      url: `/cloned-sites/${subdomain}/index.html`,
      filename: 'index.html'
    });

    // 9.5. Clona sottopagine
    for (let i = 0; i < pagesToClone.length; i++) {
      try {
        const pageUrl = pagesToClone[i];
        console.log(`📥 Cloning sottopagina ${i + 1}/${pagesToClone.length}: ${pageUrl}`);

        await page.goto(pageUrl, {
          waitUntil: 'domcontentloaded',
          timeout: 30000
        }).catch(() => {
          console.warn(`⚠️ Timeout sottopagina: ${pageUrl}`);
        });

        const subHtml = await page.content();
        const $sub = cheerio.load(subHtml);

        // Aggiorna path relativi
        $sub('link[rel="stylesheet"]').each((j, el) => {
          if (j < 10) {
            $sub(el).attr('href', `/cloned-sites/${subdomain}/css/style-${j}.css`);
          }
        });

        $sub('script[src]').each((j, el) => {
          const src = $sub(el).attr('src');
          if (src && !src.startsWith('http') && j < 5) {
            $sub(el).attr('src', `/cloned-sites/${subdomain}/js/script-${j}.js`);
          }
        });

        $sub('img[src]').each((j, el) => {
          const src = $sub(el).attr('src');
          if (src && !src.startsWith('data:') && !src.startsWith('http') && j < 10) {
            const ext = path.extname(src) || '.jpg';
            $sub(el).attr('src', `/cloned-sites/${subdomain}/images/image-${j}${ext}`);
          }
        });

        // Rimuovi credits anche dalle sottopagine
        $sub('*').each((j, el) => {
          const text = $sub(el).text().toLowerCase();
          const hasCredits = creditsPatterns.some(pattern => text.includes(pattern));
          if (hasCredits && text.length < 200) {
            $sub(el).remove();
          }
        });

        creditSelectors.forEach(selector => {
          $sub(selector).remove();
        });

        // Aggiorna link interni anche nelle sottopagine
        $sub('a[href]').each((j, el) => {
          const href = $sub(el).attr('href');
          if (href && !href.startsWith('#') && !href.startsWith('mailto:') && !href.startsWith('tel:')) {
            try {
              const fullUrl = new URL(href, pageUrl).href;
              const localPath = urlToLocalFile.get(fullUrl);
              if (localPath) {
                $sub(el).attr('href', localPath);
              }
            } catch (e) {
              // Ignora URL invalidi
            }
          }
        });

        // Salva sottopagina
        const subPath = new URL(pageUrl).pathname;
        const safePath = subPath.replace(/\//g, '_').replace(/[^a-zA-Z0-9_-]/g, '') || 'page';
        const subFilename = `${safePath}.html`;

        fs.writeFileSync(path.join(publicDir, subFilename), $sub.html());
        console.log(`✅ Sottopagina salvata: ${subFilename}`);

        // Aggiungi sottopagina all'array
        const subTitle = $sub('title').text() || subFilename.replace('.html', '');
        clonedPages.push({
          title: subTitle,
          url: `/cloned-sites/${subdomain}/${subFilename}`,
          filename: subFilename
        });

      } catch (error) {
        console.warn(`⚠️ Errore cloning sottopagina ${i + 1}: ${error}`);
      }
    }

    // 10. URL locale del sito clonato
    const clonedUrl = `http://localhost:3000/cloned-sites/${subdomain}/index.html`;

    jobsStore.set(jobId, {
      status: 'completed',
      url: clonedUrl,
      subdomain,
      pages: clonedPages,
      originalUrl,
      createdAt: jobsStore.get(jobId)!.createdAt
    });

    console.log(`✅ Cloning completato: ${jobId} -> ${clonedUrl} (${clonedPages.length} pagine)`);

  } catch (error) {
    console.error(`❌ Cloning fallito per job ${jobId}:`, error);

    jobsStore.set(jobId, {
      status: 'failed',
      subdomain,
      error: error instanceof Error ? error.message : 'Errore sconosciuto',
      createdAt: jobsStore.get(jobId)!.createdAt
    });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
