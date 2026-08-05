const fs = require('fs');
const content = fs.readFileSync('C:/Users/FINPROV/.gemini/antigravity/brain/ead95c60-fb6b-4e68-afad-79efb8792bf3/.system_generated/steps/2464/content.md', 'utf8');

const regex = /href=["']([^"']*)["']/g;
let m;
const links = [];
while ((m = regex.exec(content)) !== null) {
  if (m[1].toLowerCase().includes('verify') || m[1].toLowerCase().includes('cert')) {
    links.push(m[1]);
  }
}
console.log('Found links:', Array.from(new Set(links)));
