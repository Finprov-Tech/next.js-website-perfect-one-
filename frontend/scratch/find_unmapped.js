import fs from 'fs';

const coursesContent = fs.readFileSync('src/data/courses.ts', 'utf8');
const sitemapUrls = JSON.parse(fs.readFileSync('scratch/sitemap_urls.json', 'utf8'));

// Extract all slugs and aliases from courses.ts
const slugsInFile = new Set();

const slugRegex = /"slug":\s*"([^"]+)"/g;
let m;
while ((m = slugRegex.exec(coursesContent)) !== null) {
  slugsInFile.add(m[1].toLowerCase());
}

const aliasRegex = /"aliases":\s*\[([\s\S]*?)\]/g;
while ((m = aliasRegex.exec(coursesContent)) !== null) {
  const aliases = m[1].match(/"([^"]+)"/g) || [];
  aliases.forEach(a => slugsInFile.add(a.replace(/"/g, '').toLowerCase()));
}

console.log(`Total unique slugs/aliases in courses.ts: ${slugsInFile.size}`);

const unmapped = [];
sitemapUrls.forEach(url => {
  const s = url.replace('https://finprov.com/courses/', '').replace(/\/$/, '').toLowerCase();
  if (!slugsInFile.has(s)) {
    unmapped.push(s);
  }
});

console.log(`Unmapped sitemap URLs count: ${unmapped.length}`);
unmapped.forEach(s => console.log(` - ${s}`));
