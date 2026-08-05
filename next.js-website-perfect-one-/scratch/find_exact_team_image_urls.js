import fs from 'fs';

const html = fs.readFileSync('scratch/team_live_page.html', 'utf8');

// Match img tags
const imgs = [...html.matchAll(/<img[^>]+src="([^"]+)"[^>]*alt="([^"]*)"/gi)]
  .map(m => ({ src: m[1], alt: m[2] }))
  .filter(img => !img.src.startsWith('data:image/svg'));

console.log('Exact Real Image URLs from Live Team Page HTML:\n', JSON.stringify(imgs, null, 2));
