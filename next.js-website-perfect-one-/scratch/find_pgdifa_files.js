import fs from 'fs';

const files = fs.readdirSync('scratch/sitemap_html_cache');
const pgdifaFiles = files.filter(f => f.includes('pgdifa') || f.includes('foreign'));

pgdifaFiles.forEach(f => {
  const content = fs.readFileSync(`scratch/sitemap_html_cache/${f}`, 'utf8');
  if (content.includes('Course Snapshot') || content.includes('nine-month')) {
    console.log(`Found Snapshot in: ${f}`);
    const pos = content.indexOf('nine-month') !== -1 ? content.indexOf('nine-month') : content.indexOf('Course Snapshot');
    console.log('Snippet:', content.substring(pos - 100, pos + 300).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' '));
  } else {
    console.log(`No snapshot in: ${f}`);
  }
});
