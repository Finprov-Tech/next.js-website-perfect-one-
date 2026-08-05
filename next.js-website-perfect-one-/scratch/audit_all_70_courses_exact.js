import fs from 'fs';
import vm from 'vm';

let coursesTs = fs.readFileSync('src/data/courses.ts', 'utf8').replace(/^\uFEFF/, '');

const arrayStart = coursesTs.indexOf('export const courses');
const arrayEnd = coursesTs.indexOf('export const categories');

let arrayCode = coursesTs.substring(arrayStart, arrayEnd);

arrayCode = arrayCode
  .replace(/export const courses\s*:\s*Course\[\]\s*=/, 'const courses =')
  .replace(/as const/g, '')
  .replace(/:\s*Course/g, '');

const script = new vm.Script(arrayCode + '\nmodule.exports = courses;');
const context = vm.createContext({ module: {}, console });
const courses = script.runInContext(context);

console.log(`=================== EXACT AUDIT OF ALL ${courses.length} COURSES ===================\n`);

let duplicates = [];
let missingSnapshot = [];
let missingHero = [];
let missingOfferTabs = [];

courses.forEach((c, idx) => {
  if (!c.heroDesc || !c.heroDesc.trim()) {
    missingHero.push(c.slug || c.title || `Index ${idx}`);
  }
  if (!c.snapshotText || !c.snapshotText.trim()) {
    missingSnapshot.push(c.slug || c.title || `Index ${idx}`);
  }
  if (c.heroDesc && c.snapshotText && c.heroDesc.trim() === c.snapshotText.trim()) {
    duplicates.push({ slug: c.slug, title: c.title });
  }

  const hasSkills = Array.isArray(c.topSkills) && c.topSkills.length > 0;
  const hasWho = Array.isArray(c.whoIsThisFor) && c.whoIsThisFor.length > 0;
  const hasJobs = Array.isArray(c.jobOpportunities) && c.jobOpportunities.length > 0;

  if (!hasSkills || !hasWho || !hasJobs) {
    missingOfferTabs.push({ slug: c.slug, hasSkills, hasWho, hasJobs });
  }
});

console.log(`1. Total Primary Courses Audited: ${courses.length}`);
console.log(`2. Courses Missing heroDesc: ${missingHero.length}`);
if (missingHero.length > 0) console.log('   ->', missingHero);

console.log(`3. Courses Missing snapshotText: ${missingSnapshot.length}`);
if (missingSnapshot.length > 0) console.log('   ->', missingSnapshot);

console.log(`4. Courses with IDENTICAL heroDesc & snapshotText: ${duplicates.length}`);
if (duplicates.length > 0) {
  duplicates.forEach(d => console.log(`   ❌ [DUPLICATE] ${d.slug} ("${d.title}")`));
}

console.log(`5. Courses Missing Offer Tabs: ${missingOfferTabs.length}`);
if (missingOfferTabs.length > 0) {
  missingOfferTabs.forEach(d => console.log(`   ⚠️ [OFFER TABS] ${d.slug}`));
}

if (missingHero.length === 0 && missingSnapshot.length === 0 && duplicates.length === 0) {
  console.log('\n✓ EXCELLENT! 100% of all courses have distinct heroDesc and snapshotText!');
}
