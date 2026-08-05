import fs from 'fs';

const html = fs.readFileSync('scratch/sitemap_html_cache/pg-diploma-in-indian-and-foreign-accounting-course.html', 'utf8');

const offerPos = html.search(/offer|have\s*to\s*offer|Highlights|Coverage/i);
if (offerPos !== -1) {
  console.log('Found offer section at position:', offerPos);
  console.log('HTML snippet:\n', html.substring(offerPos, offerPos + 2000));
} else {
  console.log('No offer heading found, printing Elementor headers...');
  const headers = [...html.matchAll(/<h[234][^>]*>([\s\S]*?)<\/h[234]>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').trim());
  console.log(headers.slice(0, 20));
}
