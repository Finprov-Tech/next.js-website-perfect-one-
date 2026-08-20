import fs from 'fs';
import path from 'path';

const teamDir = 'src/assets/team';
if (!fs.existsSync(teamDir)) {
  fs.mkdirSync(teamDir, { recursive: true });
}

const teamImages = [
  { name: 'ramesh-naick.jpg', url: 'https://finprov.com/wp-content/uploads/2025/02/ramesh-sir-834x1024.jpg' },
  { name: 'anu-jose.jpg', url: 'https://finprov.com/wp-content/uploads/2025/02/anu-mam-834x1024.jpg' },
  { name: 'veena-vijayan.jpg', url: 'https://finprov.com/wp-content/uploads/2025/02/Veena_2-2.jpg' },
  { name: 'anish-thomas.webp', url: 'https://finprov.com/wp-content/uploads/2025/02/Anish-sir.webp' },
  { name: 'ashna-pillai.jpg', url: 'https://finprov.com/wp-content/uploads/2025/02/ashna-2-1.jpg' },
  { name: 'taniya-mathew.jpg', url: 'https://finprov.com/wp-content/uploads/2025/02/Taniya-maam.jpg' },
  { name: 'roshly-roy.jpg', url: 'https://finprov.com/wp-content/uploads/2025/02/Roshly-1.jpg' },
  { name: 'aneesha.jpg', url: 'https://finprov.com/wp-content/uploads/2025/02/Aneesha.jpg' },
  { name: 'deena.jpg', url: 'https://finprov.com/wp-content/uploads/2025/02/Deenac.jpg' },
  { name: 'sreejith-t.jpeg', url: 'https://finprov.com/wp-content/uploads/2025/02/WhatsApp-Image-2025-03-06-at-12.11.43-PM-1.jpeg' },
  { name: 'anand-kumar.webp', url: 'https://finprov.com/wp-content/uploads/2025/02/Anand-sir-1.webp' },
  { name: 'alex.webp', url: 'https://finprov.com/wp-content/uploads/2025/02/Alex-sir-3-1.webp' },
  { name: 'philip-luke.jpg', url: 'https://finprov.com/wp-content/uploads/2025/02/philip-sir-834x1024.jpg' },
  { name: 'sr-nair.webp', url: 'https://finprov.com/wp-content/uploads/2025/02/SK-Sir-1.webp' },
  { name: 'preetha-pk.jpg', url: 'https://finprov.com/wp-content/uploads/2025/02/preetha-1-834x1024.jpg' },
  { name: 'abin-varghese.jpg', url: 'https://finprov.com/wp-content/uploads/2025/02/abin-834x1024.jpg' }
];

async function downloadTeamImages() {
  for (const img of teamImages) {
    const dest = path.join(teamDir, img.name);
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

downloadTeamImages();
