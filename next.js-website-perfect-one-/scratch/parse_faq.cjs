const fs = require('fs');
const content = fs.readFileSync('C:/Users/FINPROV/.gemini/antigravity/brain/ead95c60-fb6b-4e68-afad-79efb8792bf3/.system_generated/steps/2552/content.md', 'utf8');

const textOnly = content.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
                        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
                        .replace(/<[^>]+>/g, '\n')
                        .split('\n')
                        .map(l => l.trim())
                        .filter(l => l.length > 0);

console.log('Total text lines:', textOnly.length);
console.log(textOnly.slice(0, 300).join('\n'));
