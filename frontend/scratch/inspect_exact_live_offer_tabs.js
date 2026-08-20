import fs from 'fs';

const html = fs.readFileSync('scratch/live_pgdifa_full.html', 'utf8');

const pos = html.indexOf('What does this course have to offer?');
if (pos !== -1) {
  const offerSection = html.substring(pos, pos + 15000);
  console.log('=== EXACT "What does this course have to offer?" SECTION HTML ===\n');

  // Extract titles and lists
  const tabs = [...offerSection.matchAll(/<button[^>]*class="[^"]*e-n-tab-title[^"]*"[^>]*>([\s\S]*?)<\/button>/gi)]
    .map(m => m[1].replace(/<[^>]+>/g, '').trim());

  console.log('Tab Titles:\n', tabs);

  // Extract all paragraphs and list items inside this section
  const contentBlocks = [...offerSection.matchAll(/<div[^>]*class="[^"]*e-n-tab-content[^"]*"[^>]*>([\s\S]*?)<\/div>/gi)]
    .map((m, idx) => {
      const blockHtml = m[1];
      const items = [...blockHtml.matchAll(/<li[^>]*>([\s\S]*?)<\/li>|<p[^>]*>([\s\S]*?)<\/p>/gi)]
        .map(x => x[1] || x[2])
        .map(x => x.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim())
        .filter(x => x.length > 5);
      return { tab: tabs[idx] || `Tab ${idx+1}`, items };
    });

  console.log('\nTab Contents:\n', JSON.stringify(contentBlocks, null, 2));
}
