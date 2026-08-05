import fs from 'fs';

const html = fs.readFileSync('scratch/live_pgdifa_full.html', 'utf8');

const pos = html.toLowerCase().indexOf('what does this course have to offer');
if (pos !== -1) {
  console.log(`Found at position ${pos}`);
  const snippet = html.substring(pos, pos + 25000);
  fs.writeFileSync('scratch/pgdifa_offer_snippet.html', snippet, 'utf8');
  console.log('Saved snippet to scratch/pgdifa_offer_snippet.html');
} else {
  console.log('Not found');
}
