import { NextRequest, NextResponse } from 'next/server';
import { jobsStore } from '../lib/jobs-store';
import puppeteer from 'puppeteer';
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

    // 1. Avvia Puppeteer
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
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

    // 3. Estrai HTML
    const html = await page.content();
    const $ = cheerio.load(html);

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

    // 9. Salva HTML
    const finalHtml = $.html();
    fs.writeFileSync(path.join(publicDir, 'index.html'), finalHtml);
    console.log(`💾 HTML salvato`);

    // 10. URL locale del sito clonato
    const clonedUrl = `http://localhost:3000/cloned-sites/${subdomain}/index.html`;

    jobsStore.set(jobId, {
      status: 'completed',
      url: clonedUrl,
      subdomain,
      createdAt: jobsStore.get(jobId)!.createdAt
    });

    console.log(`✅ Cloning completato: ${jobId} -> ${clonedUrl}`);

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
