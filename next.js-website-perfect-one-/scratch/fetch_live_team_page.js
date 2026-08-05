import fs from 'fs';

async function fetchTeamPage() {
  const url = 'https://finprov.com/team/';
  console.log('Fetching live Team page:', url);

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    if (res.ok) {
      const html = await res.text();
      fs.writeFileSync('scratch/team_live_page.html', html, 'utf8');
      console.log(`✓ Saved live team page HTML (${html.length} bytes)`);

      // Extract headings
      const headings = [...html.matchAll(/<h[1-4][^>]*>([\s\S]*?)<\/h[1-4]>/gi)]
        .map(m => m[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim())
        .filter(h => h.length > 3);

      console.log('\nHeadings on live /team/ page:\n', headings);

      // Extract paragraphs
      const ps = [...html.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)]
        .map(m => m[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim())
        .filter(p => p.length > 25 && !p.includes('Support') && !p.includes('Contact Us') && !p.includes('Skip to content'));

      console.log('\nParagraphs on live /team/ page:\n');
      ps.slice(0, 15).forEach((p, i) => console.log(`[P${i+1}]:\n  "${p}"\n`));
    } else {
      console.log('HTTP status error:', res.status);
    }
  } catch(e) {
    console.log('Error fetching team page:', e.message);
  }
}

fetchTeamPage();
