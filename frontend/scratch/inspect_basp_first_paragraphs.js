import fs from 'fs';

const html = fs.readFileSync('scratch/basp_raw_page.html', 'utf8');

const ps = [...html.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)]
  .map(m => m[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim())
  .filter(p => p.length > 20 && !p.includes('Support') && !p.includes('Contact Us') && !p.includes('Skip to content'));

ps.slice(0, 15).forEach((p, i) => console.log(`[P${i+1}]:\n  "${p}"\n`));
