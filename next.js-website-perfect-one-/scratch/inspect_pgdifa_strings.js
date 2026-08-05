import fs from 'fs';

const data = JSON.parse(fs.readFileSync('scratch/exact_hero_snapshot_data.json', 'utf8'));

console.log('PGDIFA Extracted Data:');
console.log(' - Hero Description:', data['pg-diploma-in-indian-and-foreign-accounting-pgdifa']?.heroDesc);
console.log(' - Snapshot Text:', data['pg-diploma-in-indian-and-foreign-accounting-pgdifa']?.snapshotText);
