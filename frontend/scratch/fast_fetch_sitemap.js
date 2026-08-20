import fs from 'fs';
import path from 'path';

const urls = JSON.parse(fs.readFileSync('scratch/sitemap_urls.json', 'utf8'));
const cacheDir = 'scratch/sitemap_html_cache';

if (!fs.existsSync(cacheDir)) {
  fs.mkdirSync(cacheDir, { recursive: true });
}

console.log(`Fast concurrent fetch of ${urls.length} sitemap URLs...`);

async function fetchUrl(url, i) {
  const slug = url.replace('https://finprov.com/courses/', '').replace(/\/$/, '');
  const filepath = path.join(cacheDir, `${slug}.html`);

  if (fs.existsSync(filepath) && fs.statSync(filepath).size > 1000) {
    return;
  }

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, Gecko/Chrome/120.0.0.0 Safari/537.36)'
      }
    });
    if (res.ok) {
      const html = await res.text();
      fs.writeFileSync(filepath, html, 'utf8');
      console.log(`[${i + 1}/${urls.length}] Done: ${slug}`);
    }
  } catch (err) {
    console.error(`Failed ${slug}: ${err.message}`);
  }
}

async function run() {
  const batchSize = 10;
  for (let i = 0; i < urls.length; i += batchSize) {
    const batch = urls.slice(i, i + batchSize).map((url, idx) => fetchUrl(url, i + idx));
    await Promise.all(batch);
  }
  console.log('✅ ALL SITEMAP PAGES FETCHED LOCALLY!');
}

run();
