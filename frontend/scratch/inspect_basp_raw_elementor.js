import fs from 'fs';

async function main() {
  const res = await fetch('https://finprov.com/courses/business-accounting-specialist-program-basp/', {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });

  const html = await res.text();
  fs.writeFileSync('scratch/basp_raw_page.html', html, 'utf8');

  // Extract all paragraphs in the page
  const ps = [...html.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)]
    .map(m => m[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim())
    .filter(p => p.length > 30 && !p.includes('Support') && !p.includes('Contact Us') && !p.includes('Skip to content'));

  console.log('All Paragraphs in BASP Live Page:\n');
  ps.forEach((p, i) => console.log(`[P${i+1}]:\n  "${p}"\n`));
}

main();
