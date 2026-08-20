import fs from 'fs';

const html = fs.readFileSync('scratch/sitemap_html_cache/pg-diploma-in-business-accounting-and-taxation-course-pgbat.html', 'utf8');

function cleanText(str) {
  return str.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

// Find text near "Practical Accounting" or "GST"
const idx = html.indexOf('Practical Accounting');
if (idx !== -1) {
  console.log('Context around Practical Accounting:');
  console.log(cleanText(html.substring(idx - 100, idx + 500)));
} else {
  console.log('Practical Accounting text not found directly');
}

// Print all text snippets in h2/h3/h4 tags
const headings = [...html.matchAll(/<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/gi)].map(m => cleanText(m[1]));
console.log('\nAll Headings on PGBAT Page:');
headings.forEach(h => console.log(' -', h));
