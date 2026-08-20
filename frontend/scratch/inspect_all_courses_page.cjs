const fs = require('fs');

const content = fs.readFileSync('C:\\Users\\FINPROV\\.gemini\\antigravity\\brain\\ead95c60-fb6b-4e68-afad-79efb8792bf3\\.system_generated\\steps\\939\\content.md', 'utf8');

const lines = content.split('\n');
console.log(`Total lines in scraped content: ${lines.length}`);

// Print all links in content.md
const links = [];
const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
let match;
while ((match = linkRegex.exec(content)) !== null) {
  links.push({ text: match[1], href: match[2] });
}

console.log(`Total markdown links extracted: ${links.length}`);
links.forEach(l => {
  if (l.href.includes('finprov') || l.href.includes('course')) {
    console.log(`Link: ${l.text} -> ${l.href}`);
  }
});
