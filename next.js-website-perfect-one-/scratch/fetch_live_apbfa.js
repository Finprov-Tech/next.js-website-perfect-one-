import fs from 'fs';

async function fetchLiveApbfa() {
  const urls = [
    'https://finprov.com/courses/certification-in-business-finance-and-analytics/',
    'https://finprov.com/courses/advanced-program-in-business-finance-analytics/',
    'https://finprov.com/courses/advanced-program-in-business-finance-and-analytics/'
  ];

  for (const url of urls) {
    console.log('Trying URL:', url);
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });
      if (res.ok) {
        const html = await res.text();
        fs.writeFileSync('scratch/apbfa_live_page.html', html, 'utf8');
        console.log('✓ Successfully fetched live APBFA page HTML!');

        const ps = [...html.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)]
          .map(m => m[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim())
          .filter(p => p.length > 35 && !p.includes('Support') && !p.includes('Contact Us') && !p.includes('Skip to content'));

        ps.slice(0, 10).forEach((p, i) => console.log(`[P${i+1}]:\n  "${p}"\n`));
        break;
      } else {
        console.log('HTTP status:', res.status);
      }
    } catch(e) {
      console.log('Error:', e.message);
    }
  }
}

fetchLiveApbfa();
