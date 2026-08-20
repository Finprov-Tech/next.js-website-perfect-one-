const fs = require('fs');
const content = fs.readFileSync('C:/Users/FINPROV/.gemini/antigravity/brain/ead95c60-fb6b-4e68-afad-79efb8792bf3/.system_generated/steps/2660/content.md', 'utf8');

const textOnly = content.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
                        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
                        .replace(/<[^>]+>/g, '\n')
                        .split('\n')
                        .map(l => l.trim())
                        .filter(l => l.length > 0);

textOnly.forEach((l, i) => {
  if (l.toLowerCase().includes('say about us') || l.toLowerCase().includes('sap fico') || l.toLowerCase().includes('aswathy')) {
    console.log(i, l);
  }
});
