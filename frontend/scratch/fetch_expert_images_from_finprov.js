import fs from 'fs';

const liveHtml = fs.readFileSync('scratch/live_pgdifa_full.html', 'utf8');

const imgMatches = [...liveHtml.matchAll(/<img[^>]+src="([^"]+)"[^>]*alt="([^"]*)"/gi)]
  .map(m => ({ src: m[1], alt: m[2] }));

console.log('All images in PGDIFA live HTML matching experts:\n');
imgMatches.forEach(img => {
  if (img.alt.toLowerCase().includes('anand') || img.alt.toLowerCase().includes('veena') ||
      img.alt.toLowerCase().includes('taniya') || img.alt.toLowerCase().includes('anish') ||
      img.src.toLowerCase().includes('anand') || img.src.toLowerCase().includes('veena') ||
      img.src.toLowerCase().includes('taniya') || img.src.toLowerCase().includes('anish')) {
    console.log(img);
  }
});
