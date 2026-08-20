const fs = require('fs');
const content = fs.readFileSync('C:/Users/FINPROV/.gemini/antigravity/brain/ead95c60-fb6b-4e68-afad-79efb8792bf3/.system_generated/steps/2660/content.md', 'utf8');

const idx = content.indexOf('Hear What Our Students');
if (idx !== -1) {
  console.log(content.slice(idx - 100, idx + 4000));
} else {
  console.log('Not found in 2660');
}
