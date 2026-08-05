const fs = require('fs');
const content = fs.readFileSync('C:/Users/FINPROV/.gemini/antigravity/brain/ead95c60-fb6b-4e68-afad-79efb8792bf3/.system_generated/steps/2513/content.md', 'utf8');

const idx = content.indexOf('Certificate Verification Portal');
if (idx !== -1) {
  console.log(content.slice(idx - 200, idx + 2000));
} else {
  console.log('Not found');
}
