import fs from 'fs';

const xml = fs.readFileSync('C:/Users/FINPROV/.gemini/antigravity/brain/ead95c60-fb6b-4e68-afad-79efb8792bf3/.system_generated/steps/3024/content.md', 'utf8');

const locMatches = [...xml.matchAll(/<loc>(https:\/\/finprov\.com\/courses\/[^<]+)<\/loc>/g)];
const urls = locMatches.map(m => m[1]);

console.log(`Found ${urls.length} course URLs in sitemap:`);
urls.forEach((u, i) => console.log(`${i + 1}. ${u}`));

fs.writeFileSync('c:/Users/FINPROV/Downloads/build-bright-paths-54/scratch/sitemap_urls.json', JSON.stringify(urls, null, 2));
