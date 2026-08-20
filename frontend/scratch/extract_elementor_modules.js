import fs from 'fs';

const html = fs.readFileSync('scratch/sitemap_html_cache/pg-diploma-in-business-accounting-and-taxation-course-pgbat.html', 'utf8');

// Find any occurrence of accordion / module text in the raw HTML
const matches = [...html.matchAll(/(Module\s*\d+[^<]*|<h[345][^>]*>[^<]*Module[^<]*<\/h[345]>)/gi)];
console.log('Found Module occurrences:', matches.length);
matches.slice(0, 10).forEach(m => console.log(' ->', m[0].trim()));
