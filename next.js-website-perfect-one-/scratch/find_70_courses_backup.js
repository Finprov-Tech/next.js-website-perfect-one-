import fs from 'fs';

const files = fs.readdirSync('scratch');
files.forEach(f => {
  if (f.endsWith('.json') || f.endsWith('.ts')) {
    try {
      const content = fs.readFileSync(`scratch/${f}`, 'utf8');
      if (content.includes('slug') && content.length > 50000) {
        console.log(`File: ${f} (size: ${(content.length/1024).toFixed(1)} KB)`);
        const matches = content.match(/"slug":/g) || [];
        console.log(` - slug count: ${matches.length}`);
      }
    } catch(e) {}
  }
});
