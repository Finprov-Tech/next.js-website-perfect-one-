import fs from 'fs';

let coursesContent = fs.readFileSync('src/data/courses.ts', 'utf8');

const missingMappings = {
  'certification-in-business-finance-and-analytics': 'certification-in-business-finance-and-analytics-course-cbfa',
  'certified-finance-manager': 'certified-finance-manager-course-cfm',
  'certification-in-business-accounting-taxation': 'certification-in-business-accounting-and-taxation-course-cbat',
  'pg-diploma-in-indian-and-foreign-accounting-course': 'pg-diploma-in-indian-and-foreign-accounting-course-pgdifa',
  'sap-fico-course': 'sap-s-4hana-fi',
  'sap-s-4hana-fi-uae': 'sap-s-4hana-fi',
  'sap-mm-material-management': 'sap-s-4hana-mm-materials-management-uae'
};

for (const [sitemapSlug, targetSlug] of Object.entries(missingMappings)) {
  const targetPattern = `"slug": "${targetSlug}"`;
  const targetIndex = coursesContent.indexOf(targetPattern);
  if (targetIndex !== -1) {
    if (!coursesContent.includes(`"${sitemapSlug}"`)) {
      const aliasesPattern = `"aliases": [`;
      const aliasesIndex = coursesContent.indexOf(aliasesPattern, targetIndex);
      if (aliasesIndex !== -1 && aliasesIndex - targetIndex < 300) {
        coursesContent = coursesContent.substring(0, aliasesIndex + 14) + `\n      "${sitemapSlug}",` + coursesContent.substring(aliasesIndex + 14);
        console.log(`✓ Added alias "${sitemapSlug}" to "${targetSlug}"`);
      } else {
        coursesContent = coursesContent.substring(0, targetIndex + targetPattern.length) + `,\n    "aliases": [\n      "${sitemapSlug}"\n    ]` + coursesContent.substring(targetIndex + targetPattern.length);
        console.log(`✓ Created aliases array for "${targetSlug}" with "${sitemapSlug}"`);
      }
    }
  } else {
    console.log(`Target slug NOT FOUND for alias mapping: ${targetSlug}`);
  }
}

fs.writeFileSync('src/data/courses.ts', coursesContent, 'utf8');
console.log('✅ All missing alias mappings updated!');
