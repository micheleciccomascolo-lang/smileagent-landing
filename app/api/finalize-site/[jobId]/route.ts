import { NextRequest, NextResponse } from 'next/server';
import { jobsStore } from '../../lib/jobs-store';
import * as cheerio from 'cheerio';
import * as fs from 'fs';
import * as path from 'path';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    const { jobId } = await params;

    const job = jobsStore.get(jobId);

    if (!job) {
      return NextResponse.json(
        { error: 'Job non trovato' },
        { status: 404 }
      );
    }

    if (job.status !== 'completed') {
      return NextResponse.json(
        { error: 'Il job deve essere in stato "completed" per essere finalizzato' },
        { status: 400 }
      );
    }

    // Directory del sito clonato
    const publicDir = path.join(process.cwd(), 'public', 'cloned-sites', job.subdomain);

    if (!fs.existsSync(publicDir)) {
      return NextResponse.json(
        { error: 'Directory del sito clonato non trovata' },
        { status: 404 }
      );
    }

    console.log(`🔧 Finalizzazione sito: ${jobId} (${job.subdomain})`);

    // Leggi tutti i file HTML
    const htmlFiles = fs.readdirSync(publicDir).filter(file => file.endsWith('.html'));

    console.log(`📄 Trovati ${htmlFiles.length} file HTML da processare`);

    // Processa ogni file HTML
    for (const htmlFile of htmlFiles) {
      const filePath = path.join(publicDir, htmlFile);
      const html = fs.readFileSync(filePath, 'utf-8');
      const $ = cheerio.load(html);

      // Converti tutti i link da assoluti a relativi
      $('a[href]').each((i, el) => {
        const href = $(el).attr('href');
        if (href && href.startsWith(`/cloned-sites/${job.subdomain}/`)) {
          // Rimuovi il prefisso e rendi relativo
          const relativePath = href.replace(`/cloned-sites/${job.subdomain}/`, '');
          $(el).attr('href', relativePath);
        }
      });

      // Converti CSS da assoluti a relativi
      $('link[rel="stylesheet"]').each((i, el) => {
        const href = $(el).attr('href');
        if (href && href.startsWith(`/cloned-sites/${job.subdomain}/`)) {
          const relativePath = href.replace(`/cloned-sites/${job.subdomain}/`, '');
          $(el).attr('href', relativePath);
        }
      });

      // Converti JS da assoluti a relativi
      $('script[src]').each((i, el) => {
        const src = $(el).attr('src');
        if (src && src.startsWith(`/cloned-sites/${job.subdomain}/`)) {
          const relativePath = src.replace(`/cloned-sites/${job.subdomain}/`, '');
          $(el).attr('src', relativePath);
        }
      });

      // Converti immagini da assolute a relative
      $('img[src]').each((i, el) => {
        const src = $(el).attr('src');
        if (src && src.startsWith(`/cloned-sites/${job.subdomain}/`)) {
          const relativePath = src.replace(`/cloned-sites/${job.subdomain}/`, '');
          $(el).attr('src', relativePath);
        }
      });

      // Salva il file aggiornato
      fs.writeFileSync(filePath, $.html());
      console.log(`✅ ${htmlFile} finalizzato con link relativi`);
    }

    // Aggiorna anche le URL nelle pagine salvate nel job
    const updatedPages = job.pages?.map(page => ({
      ...page,
      url: page.filename // Usa solo il filename relativo
    }));

    // Aggiorna lo stato del job
    jobsStore.set(jobId, {
      ...job,
      status: 'finalized',
      pages: updatedPages
    });

    console.log(`🎉 Finalizzazione completata: ${jobId}`);

    return NextResponse.json({
      success: true,
      jobId,
      status: 'finalized',
      message: 'Sito finalizzato con successo. Ora puoi puntare il tuo dominio.'
    });

  } catch (error) {
    console.error('Errore finalize-site:', error);
    return NextResponse.json(
      { error: 'Errore durante la finalizzazione' },
      { status: 500 }
    );
  }
}
