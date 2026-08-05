import fs from 'fs';

const backup = fs.readFileSync('scratch/courses_backup_7d0bbee.ts', 'utf8');
fs.writeFileSync('src/data/courses.ts', backup, 'utf8');

console.log('✓ Successfully restored 70 primary courses into src/data/courses.ts!');
