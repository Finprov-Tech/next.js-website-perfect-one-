import fs from 'fs';

const pgbatHtml = fs.readFileSync('scratch/sitemap_html_cache/pg-diploma-in-business-accounting-and-taxation-course-pgbat.html', 'utf8');
const pgdifaHtml = fs.readFileSync('scratch/sitemap_html_cache/pg-diploma-in-indian-and-foreign-accounting-course.html', 'utf8');

function findOfferSection(html, name) {
  console.log(`\n=================== ${name} ===================`);
  // Search for headings or Elementor widgets
  const matches = [...html.matchAll(/<h[1-4][^>]*>([\s\S]*?)<\/h[1-4]>/gi)]
    .map(m => m[1].replace(/<[^>]+>/g, '').trim())
    .filter(h => h.length > 5);

  console.log('All Headings in Page:\n', matches.slice(0, 25));
}

findOfferSection(pgdifaHtml, 'PGDIFA');
findOfferSection(pgbatHtml, 'PGBAT');
