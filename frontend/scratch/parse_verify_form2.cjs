const fs = require('fs');
const content = fs.readFileSync('C:/Users/FINPROV/.gemini/antigravity/brain/ead95c60-fb6b-4e68-afad-79efb8792bf3/.system_generated/steps/2513/content.md', 'utf8');

const regex = /<(input|form|button|select)[^>]*>/gi;
let m;
while ((m = regex.exec(content)) !== null) {
  console.log(m[0]);
}
