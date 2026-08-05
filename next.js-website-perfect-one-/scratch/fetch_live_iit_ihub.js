import fs from 'fs';

async function fetchLiveIitIhub() {
  const url = 'https://finprov.com/courses/iit-ihub-certified-digital-marketing-program/';
  console.log('Fetching live URL:', url);

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    if (res.ok) {
      const html = await res.text();
      fs.writeFileSync('scratch/iit_ihub_live.html', html, 'utf8');

      const ps = [...html.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)]
        .map(m => m[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim())
        .filter(p => p.length > 35 && !p.includes('Support') && !p.includes('Contact Us') && !p.includes('Skip to content'));

      console.log('All Paragraphs in IIT IHub Live Page:\n');
      ps.slice(0, 10).forEach((p, i) => console.log(`[P${i+1}]:\n  "${p}"\n`));
    } else {
      console.log('HTTP status:', res.status);
    }
  } catch(e) {
    console.log('Error:', e.message);
  }
}

fetchLiveIitIhub();
