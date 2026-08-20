import fs from 'fs';

const teamTsx = fs.readFileSync('src/routes/team.tsx', 'utf8');

// Extract all imported identifiers from lucide-react
const lucideMatch = teamTsx.match(/import\s*\{([\s\S]*?)\}\s*from\s*"lucide-react";/);
const importedLucide = lucideMatch ? lucideMatch[1].split(',').map(s => s.trim()).filter(Boolean) : [];

console.log('Imported lucide-react icons:\n', importedLucide);

// Find all capitalized JSX tags used in team.tsx
const jsxTags = [...new Set([...teamTsx.matchAll(/<([A-Z][A-Za-z0-9]*)\b/g)].map(m => m[1]))];

console.log('\nAll Capitalized JSX Tags in team.tsx:\n', jsxTags);

// Find all top-level declared identifiers in team.tsx
const declared = [
  ...importedLucide,
  'Link', 'createFileRoute', 'motion', 'useState', 'SiteHeader', 'SiteFooter', 'Reveal',
  'StaggerGrid', 'StaggerItem', 'EnquireModal', 'anandPhoto', 'veenaPhoto', 'taniyaPhoto', 'anishPhoto',
  'TeamPage', 'Route', 'container', 'TeamMember', 'leadershipMembers', 'facultyMembers', 'advisorsAndOps'
];

const missing = jsxTags.filter(tag => !declared.includes(tag));

console.log('\nMissing / Undefined Component Tags:\n', missing);
