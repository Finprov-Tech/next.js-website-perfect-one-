import fs from 'fs';
import path from 'path';

const urls = JSON.parse(fs.readFileSync('scratch/sitemap_urls.json', 'utf8'));
const cacheDir = 'scratch/sitemap_html_cache';

if (!fs.existsSync(cacheDir)) {
  fs.mkdirSync(cacheDir, { recursive: true });
}

console.log(`Starting fetch of ${urls.length} sitemap URLs...`);

async function fetchAll() {
  let fetched = 0;
  let skipped = 0;

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    const slug = url.replace('https://finprov.com/courses/', '').replace(/\/$/, '');
    const filepath = path.join(cacheDir, `${slug}.html`);

    if (fs.existsSync(filepath)) {
      skipped++;
      continue;
    }

    try {
      console.log(`[${i + 1}/${urls.length}] Fetching: ${slug}...`);
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, Gecko/Chrome/120.0.0.0 Safari/537.36)'
        }
      });
      if (!res.ok) {
        console.error(`Failed ${url}: ${res.status}`);
        continue;
      }
      const html = await res.text();
      fs.writeFileSync(filepath, html, 'utf8');
      fetched++;
      // Sleep slightly to avoid spamming server
      await new Promise(r => setTimeout(r, 200));
    } catch (err) {
      console.error(`Error fetching ${url}: ${err.message}`);
    }
  }

  console.log(`Fetch complete. Fetched: ${fetched}, Skipped (cached): ${skipped}`);
}

fetchAll();
