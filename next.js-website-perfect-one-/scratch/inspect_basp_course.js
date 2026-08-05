import fs from 'fs';

const coursesTs = fs.readFileSync('src/data/courses.ts', 'utf8');

// Find BASP block
const baspPos = coursesTs.indexOf('"business-accounting-specialist-program-basp"') || coursesTs.indexOf('BASP');
if (baspPos !== -1) {
  const start = coursesTs.lastIndexOf('{', baspPos);
  const end = coursesTs.indexOf('}', baspPos);
  console.log('Current BASP course block in courses.ts:\n', coursesTs.substring(start, end + 1));
}

// Fetch live BASP page from finprov.com
async function fetchLiveBasp() {
  const url = 'https://finprov.com/courses/business-accounting-specialist-program-basp/';
  console.log('\nFetching live BASP page from finprov.com:', url);

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    if (res.ok) {
      const html = await res.text();
      let mainHtml = html;
      const headerCut = mainHtml.indexOf('</header>');
      if (headerCut !== -1) mainHtml = mainHtml.substring(headerCut);

      // Extract Hero Paragraph (under H1)
      const h1Match = mainHtml.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || mainHtml.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i);
      let heroDesc = '';
      if (h1Match) {
        const h1Pos = mainHtml.indexOf(h1Match[0]);
        const afterH1 = mainHtml.substring(h1Pos + h1Match[0].length);
        const pMatches = [...afterH1.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)]
          .map(m => m[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim())
          .filter(p => p.length > 40 && !p.includes('Support') && !p.includes('Contact Us') && !p.includes('All Courses') && !p.includes('Skip to content'));
        heroDesc = pMatches[0] || '';
      }

      // Extract Course Snapshot Paragraph (under Course Snapshot)
      const snapPos = mainHtml.toLowerCase().indexOf('snapshot');
      let snapshotText = '';
      if (snapPos !== -1) {
        const afterSnap = mainHtml.substring(snapPos);
        const pMatches = [...afterSnap.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)]
          .map(m => m[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim())
          .filter(p => p.length > 40 && !p.includes('applied in') && !p.includes('Get Started'));
        snapshotText = pMatches[0] || '';
      }

      console.log('\n--- Live BASP Hero Description ---');
      console.log(`"${heroDesc}"`);

      console.log('\n--- Live BASP Course Snapshot ---');
      console.log(`"${snapshotText}"`);
    } else {
      console.log('HTTP error:', res.status);
    }
  } catch(e) {
    console.log('Error fetching live BASP page:', e.message);
  }
}

fetchLiveBasp();
