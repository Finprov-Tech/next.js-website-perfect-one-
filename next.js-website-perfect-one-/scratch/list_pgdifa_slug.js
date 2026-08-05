import fs from 'fs';

const data = JSON.parse(fs.readFileSync('scratch/exact_hero_snapshot_data.json', 'utf8'));

Object.keys(data).filter(k => k.includes('pgdifa') || k.includes('foreign')).forEach(k => {
  console.log('Found key:', k);
  console.log(' - Hero:', data[k].heroDesc);
  console.log(' - Snapshot:', data[k].snapshotText);
});
