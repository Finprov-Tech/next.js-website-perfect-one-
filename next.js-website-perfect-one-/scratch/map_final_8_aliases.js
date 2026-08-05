import fs from 'fs';

let content = fs.readFileSync('src/data/courses.ts', 'utf8');

const finalMappings = [
  { sitemapSlug: 'certification-in-business-finance-and-analytics', searchStr: 'cbfa' },
  { sitemapSlug: 'certified-finance-manager', searchStr: 'cfm' },
  { sitemapSlug: 'sap-s-4hana-mm-materials-management-uae', searchStr: 'materials' },
  { sitemapSlug: 'mis-analyst', searchStr: 'mis-analyst' },
  { sitemapSlug: 'sap-mm-material-management', searchStr: 'materials' },
  { sitemapSlug: 'advanced-tally-prime-and-gulf-vat', searchStr: 'advanced-tally-prime-and-gulf-vat' },
  { sitemapSlug: 'startup-planning-and-fundraising-strategies', searchStr: 'startup-planning' },
  { sitemapSlug: 'certification-in-business-accounting-taxation', searchStr: 'cbat' }
];

for (const item of finalMappings) {
  const idx = content.indexOf(item.searchStr);
  if (idx !== -1) {
    const slugIdx = content.lastIndexOf('"slug":', idx);
    if (slugIdx !== -1) {
      const aliasIdx = content.indexOf('"aliases": [', slugIdx);
      if (aliasIdx !== -1 && aliasIdx - slugIdx < 300) {
        content = content.substring(0, aliasIdx + 14) + `\n      "${item.sitemapSlug}",` + content.substring(aliasIdx + 14);
        console.log(`✓ Added alias "${item.sitemapSlug}"`);
      } else {
        const nextLine = content.indexOf('\n', slugIdx);
        content = content.substring(0, nextLine) + `,\n    "aliases": [\n      "${item.sitemapSlug}"\n    ]` + content.substring(nextLine);
        console.log(`✓ Created aliases array for "${item.sitemapSlug}"`);
      }
    }
  } else {
    console.log(`Search str not found: ${item.searchStr}`);
  }
}

fs.writeFileSync('src/data/courses.ts', content, 'utf8');
console.log('✅ Final 8 aliases mapped!');
