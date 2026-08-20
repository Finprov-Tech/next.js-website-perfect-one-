import fs from 'fs';
import path from 'path';

const cacheDir = 'scratch/sitemap_html_cache';
const files = fs.readdirSync(cacheDir);

console.log(`Checking ${files.length} HTML files for 'Snapshot' or 'Course Snapshot'...`);

let foundCount = 0;
files.forEach(f => {
  const content = fs.readFileSync(path.join(cacheDir, f), 'utf8');
  if (content.toLowerCase().includes('snapshot')) {
    foundCount++;
    const pos = content.toLowerCase().indexOf('snapshot');
    const snippet = content.substring(pos - 50, pos + 300).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
    console.log(`\nFile: ${f}`);
    console.log(`Snippet: "${snippet}"`);
  }
});

console.log(`\nTotal files containing 'snapshot': ${foundCount}`);
