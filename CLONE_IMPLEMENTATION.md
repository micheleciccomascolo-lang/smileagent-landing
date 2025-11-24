# Implementazione Clone del Sito

## Stato Attuale

La landing page per il clone del sito è stata creata e funziona con una **simulazione** del processo di cloning.

### Cosa è stato implementato:

1. ✅ **Pagina `/clone`** - Form per inserire l'URL del sito da clonare
2. ✅ **API `/api/clone-site`** - Endpoint che riceve l'URL e crea un job
3. ✅ **API `/api/job-status/[jobId]`** - Endpoint per verificare lo stato del job
4. ✅ **Polling automatico** - La UI controlla ogni 5 secondi lo stato del job
5. ✅ **UI completa** - Indicatori di progresso, risultati, istruzioni DNS

### Demo

La demo attualmente:
- Accetta qualsiasi URL valido
- Crea un job ID univoco
- Simula 8 secondi di processing
- Restituisce un URL di successo `https://{subdomain}.agentia.app`

## Implementazione Reale del Cloning

Per implementare il cloning reale, dovrai completare la funzione `simulateCloning()` in:
```
app/api/clone-site/route.ts
```

### Passaggi per l'implementazione completa:

---

### 1. Installare le dipendenze necessarie

```bash
npm install puppeteer cheerio axios sharp
npm install @types/cheerio --save-dev
```

- **puppeteer**: Per navigare il sito e catturare il DOM
- **cheerio**: Per parsing e manipolazione HTML
- **axios**: Per scaricare assets (CSS, JS, immagini)
- **sharp**: Per ottimizzare immagini

---

### 2. Setup di un sistema di storage (S3, R2, Vercel Blob)

Opzione A: **AWS S3**
```bash
npm install @aws-sdk/client-s3
```

Opzione B: **Cloudflare R2** (più economico)
```bash
npm install @aws-sdk/client-s3  # R2 usa l'API S3
```

Opzione C: **Vercel Blob** (più semplice)
```bash
npm install @vercel/blob
```

---

### 3. Setup Database (per i jobs)

Attualmente i jobs sono in memoria (Map). In produzione serve un database.

Opzione A: **Vercel KV (Redis)** - Semplice e veloce
```bash
npm install @vercel/kv
```

Opzione B: **PostgreSQL** (più robusto)
```bash
npm install pg
npm install @types/pg --save-dev
```

Opzione C: **MongoDB**
```bash
npm install mongodb
```

---

### 4. Implementare la logica di cloning

Sostituisci la funzione `simulateCloning()` con qualcosa del genere:

```typescript
import puppeteer from 'puppeteer';
import cheerio from 'cheerio';
import axios from 'axios';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

async function realCloning(jobId: string, originalUrl: string, subdomain: string) {
  let browser;

  try {
    // 1. Avvia Puppeteer
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    // 2. Naviga al sito
    await page.goto(originalUrl, {
      waitUntil: 'networkidle0',
      timeout: 30000
    });

    // 3. Estrai HTML
    const html = await page.content();
    const $ = cheerio.load(html);

    // 4. Trova tutti gli assets
    const cssLinks: string[] = [];
    const jsLinks: string[] = [];
    const imgLinks: string[] = [];

    $('link[rel="stylesheet"]').each((i, el) => {
      const href = $(el).attr('href');
      if (href) cssLinks.push(new URL(href, originalUrl).href);
    });

    $('script[src]').each((i, el) => {
      const src = $(el).attr('src');
      if (src) jsLinks.push(new URL(src, originalUrl).href);
    });

    $('img[src]').each((i, el) => {
      const src = $(el).attr('src');
      if (src && !src.startsWith('data:')) {
        imgLinks.push(new URL(src, originalUrl).href);
      }
    });

    // 5. Scarica tutti gli assets
    const downloadedAssets = await Promise.all([
      ...cssLinks.map(url => downloadAsset(url, 'css')),
      ...jsLinks.map(url => downloadAsset(url, 'js')),
      ...imgLinks.map(url => downloadAsset(url, 'img'))
    ]);

    // 6. Modifica HTML per puntare ai nuovi assets
    $('link[rel="stylesheet"]').each((i, el) => {
      const href = $(el).attr('href');
      if (href) {
        const newPath = `/assets/css/${getFilename(href)}`;
        $(el).attr('href', newPath);
      }
    });

    $('script[src]').each((i, el) => {
      const src = $(el).attr('src');
      if (src && !src.startsWith('http')) {
        const newPath = `/assets/js/${getFilename(src)}`;
        $(el).attr('src', newPath);
      }
    });

    $('img[src]').each((i, el) => {
      const src = $(el).attr('src');
      if (src && !src.startsWith('http') && !src.startsWith('data:')) {
        const newPath = `/assets/img/${getFilename(src)}`;
        $(el).attr('src', newPath);
      }
    });

    // 7. Upload a S3/Storage
    const s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
      }
    });

    // Upload HTML
    await s3Client.send(new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `${subdomain}/index.html`,
      Body: $.html(),
      ContentType: 'text/html',
      ACL: 'public-read'
    }));

    // Upload assets
    for (const asset of downloadedAssets) {
      await s3Client.send(new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `${subdomain}/${asset.path}`,
        Body: asset.content,
        ContentType: asset.contentType,
        ACL: 'public-read'
      }));
    }

    // 8. Configura DNS (opzionale, dipende dal tuo setup)
    // await configureDNS(subdomain);

    // 9. Aggiorna job status
    const clonedUrl = `https://${subdomain}.agentia.app`;
    await updateJobStatus(jobId, 'completed', { url: clonedUrl });

    console.log(`✅ Cloning completato: ${clonedUrl}`);

  } catch (error) {
    console.error('❌ Errore cloning:', error);
    await updateJobStatus(jobId, 'failed', {
      error: error instanceof Error ? error.message : 'Errore sconosciuto'
    });
  } finally {
    if (browser) await browser.close();
  }
}

async function downloadAsset(url: string, type: string) {
  try {
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      timeout: 10000
    });

    return {
      path: `assets/${type}/${getFilename(url)}`,
      content: response.data,
      contentType: response.headers['content-type']
    };
  } catch (error) {
    console.warn(`Fallito download di: ${url}`);
    return null;
  }
}

function getFilename(url: string): string {
  return url.split('/').pop() || 'unnamed';
}
```

---

### 5. Configurare variabili d'ambiente

Crea un file `.env.local`:

```bash
# Storage (S3/R2)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
S3_BUCKET_NAME=agentia-sites

# Database (se usi Vercel KV)
KV_REST_API_URL=your_kv_url
KV_REST_API_TOKEN=your_kv_token

# Cloudflare (per DNS automatico - opzionale)
CLOUDFLARE_TOKEN=your_cloudflare_token
CLOUDFLARE_ZONE_ID=your_zone_id
```

---

### 6. Setup CDN e DNS

Due opzioni:

**Opzione A: Cloudflare Pages**
- Upload i file su Cloudflare Pages
- DNS automatico su `*.agentia.app`

**Opzione B: Vercel + Custom Domains**
- Deploy su Vercel
- Setup wildcard domain `*.agentia.app`

**Opzione C: S3 + CloudFront**
- S3 per storage
- CloudFront per CDN
- Route53 per DNS

---

### 7. Background Jobs (per siti grandi)

Per siti grandi (>50 pagine), usa un sistema di queue:

**Opzione A: Vercel Background Functions**
```bash
npm install @vercel/edge-config
```

**Opzione B: Bull Queue + Redis**
```bash
npm install bull redis
```

**Opzione C: AWS SQS**
```bash
npm install @aws-sdk/client-sqs
```

---

## Limitazioni e Considerazioni

### Limitazioni tecniche:

1. **JavaScript dinamico**: Siti con molto JS potrebbero non funzionare perfettamente
2. **Auth/Forms**: Form e aree autenticate non saranno clonati
3. **Backend**: Solo frontend HTML/CSS/JS, niente backend logic
4. **Dimensione**: Limita numero di pagine (es. max 50 pagine per job)

### Considerazioni legali:

⚠️ **IMPORTANTE**: Assicurati di avere i diritti per clonare un sito.
- Solo per siti del cliente
- Non clonare siti di terze parti senza permesso
- Rispetta copyright e proprietà intellettuale

### Performance:

- **Timeout**: Imposta timeout appropriati (max 10 min per job)
- **Rate limiting**: Limita richieste per evitare DDoS involontari
- **Caching**: Cachea assets comuni (jQuery, Bootstrap, etc.)

---

## Testing

Per testare il cloning reale:

1. Crea un sito di test semplice
2. Testa con siti statici prima (HTML puro)
3. Poi prova con siti più complessi (React, Vue, etc.)
4. Verifica che gli assets siano caricati correttamente
5. Controlla che i link interni funzionino

### Siti di test consigliati:

- `https://example.com` - Semplice HTML
- Il tuo sito personale
- Un sito statico su GitHub Pages

---

## Prossimi Step

1. Implementare la logica di cloning reale
2. Setup storage (S3/R2/Vercel Blob)
3. Setup database per i jobs
4. Testare con siti reali
5. Aggiungere limitazioni (rate limiting, size limits)
6. Setup DNS wildcard per i sottodomini
7. Aggiungere analytics per monitorare usage

---

## Supporto

Per domande o supporto:
- Email: support@smileagent.it
- GitHub Issues: [link al repo]

---

## Note sulla Demo

La demo attuale è completamente funzionale come **proof of concept**.
I clienti possono vedere il flow completo:
1. Inserimento URL
2. Processing
3. Risultato con URL e istruzioni DNS

Questo ti permette di testare l'UX prima di implementare il cloning reale.
