import fs from 'fs';

async function fetchLiveOffer() {
  const url = 'https://finprov.com/courses/pg-diploma-in-indian-and-foreign-accounting-course/';
  console.log('Fetching live URL:', url);

  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });

  const html = await res.text();
  console.log(`Received HTML length: ${html.length}`);

  // Save to inspect
  fs.writeFileSync('scratch/live_pgdifa_full.html', html, 'utf8');

  // Search for offer or key highlights
  const pos = html.toLowerCase().indexOf('offer');
  if (pos !== -1) {
    console.log('\nFound "offer" at index:', pos);
    console.log('Snippet:\n', html.substring(pos - 100, pos + 500).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' '));
  } else {
    console.log('No "offer" word found directly in page HTML');
  }

  // Search for "skills" or "who" or "why"
  const whoPos = html.toLowerCase().indexOf('who');
  if (whoPos !== -1) {
    console.log('\nFound "who" snippet:\n', html.substring(whoPos - 50, whoPos + 300).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' '));
  }
}

fetchLiveOffer();
