import fs from 'fs';
import path from 'path';

const expertsDir = 'src/assets/experts';
if (!fs.existsSync(expertsDir)) {
  fs.mkdirSync(expertsDir, { recursive: true });
}

const images = [
  { name: 'anand-kumar.webp', url: 'https://finprov.com/wp-content/uploads/2025/02/CA-Anand-Kumar.webp' },
  { name: 'veena-vijayan.webp', url: 'https://finprov.com/wp-content/uploads/2025/02/CA-Veena-Vijayan.webp' },
  { name: 'taniya-mathew.webp', url: 'https://finprov.com/wp-content/uploads/2025/02/CA-Taniya-Mathew.webp' },
  { name: 'anish-thomas.webp', url: 'https://finprov.com/wp-content/uploads/2025/02/CA-Anish-Thomas.webp' }
];

async function downloadImages() {
  for (const img of images) {
    const dest = path.join(expertsDir, img.name);
    console.log(`Downloading ${img.url} -> ${dest}`);
    try {
      const res = await fetch(img.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });
      if (res.ok) {
        const buffer = Buffer.from(await res.arrayBuffer());
        fs.writeFileSync(dest, buffer);
        console.log(`✓ Saved ${img.name} (${buffer.length} bytes)`);
      } else {
        console.log(`HTTP error ${res.status} for ${img.name}`);
      }
    } catch(e) {
      console.log(`Error downloading ${img.name}:`, e.message);
    }
  }
}

downloadImages();
