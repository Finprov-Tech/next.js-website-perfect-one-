import fs from 'fs';

const html = fs.readFileSync('scratch/team_live_page.html', 'utf8');

// Search for team member cards or blocks in HTML
const imgMatches = [...html.matchAll(/<img[^>]+src="([^"]+)"[^>]*alt="([^"]*)"/gi)]
  .map(m => ({ src: m[1], alt: m[2] }));

console.log('All Images on Team Page:\n');
imgMatches.forEach(img => {
  if (img.alt && !img.alt.includes('logo') && !img.alt.includes('icon')) {
    console.log(`Alt: "${img.alt}" | Src: "${img.src}"`);
  }
});
