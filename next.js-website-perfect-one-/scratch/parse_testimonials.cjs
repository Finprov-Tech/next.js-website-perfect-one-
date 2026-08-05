const fs = require('fs');
const content = fs.readFileSync('C:/Users/FINPROV/.gemini/antigravity/brain/ead95c60-fb6b-4e68-afad-79efb8792bf3/.system_generated/steps/2660/content.md', 'utf8');

const matches = content.match(/Hear What Our Students Have To Say[\s\S]*?(?=Explore|Copyright|Popular Courses)/i);
if (matches) {
  console.log(matches[0].slice(0, 3000));
} else {
  console.log('Heading not found');
}
