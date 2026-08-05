import fs from 'fs';

const map = JSON.parse(fs.readFileSync('scratch/full_extracted_sitemap_map.json', 'utf8'));

let withFaqs = 0;
let withCurriculum = 0;
let totalFaqs = 0;
let totalModules = 0;

for (const [slug, data] of Object.entries(map)) {
  if (data.faqs && data.faqs.length > 0) {
    withFaqs++;
    totalFaqs += data.faqs.length;
  }
  if (data.curriculum && data.curriculum.length > 0) {
    withCurriculum++;
    totalModules += data.curriculum.length;
  }
}

console.log(`Sitemap HTML Cache Content Stats:`);
console.log(` - Total Cached Course Pages: ${Object.keys(map).length}`);
console.log(` - Pages with FAQs: ${withFaqs} (Total FAQs: ${totalFaqs})`);
console.log(` - Pages with Curriculum Modules: ${withCurriculum} (Total Modules: ${totalModules})`);
