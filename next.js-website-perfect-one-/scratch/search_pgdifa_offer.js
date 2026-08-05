import fs from 'fs';

const html = fs.readFileSync('scratch/live_pgdifa_full.html', 'utf8');

const matches = [...html.matchAll(/<h[1-4][^>]*>([\s\S]*?)<\/h[1-4]>/gi)]
  .map(m => m[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim())
  .filter(h => h.length > 5);

console.log('All Headings in PGDIFA Page HTML:\n', matches);
