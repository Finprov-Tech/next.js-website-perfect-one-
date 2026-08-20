const fs = require('fs');
const content = fs.readFileSync('C:/Users/FINPROV/.gemini/antigravity/brain/ead95c60-fb6b-4e68-afad-79efb8792bf3/.system_generated/steps/2731/content.md', 'utf8');

const regex = /(Aswathy|Aebel|testimonial|slider|swiper|carousel)/gi;
let m;
const found = new Set();
while ((m = regex.exec(content)) !== null) {
  found.add(m[0]);
}
console.log('Found terms:', Array.from(found));
