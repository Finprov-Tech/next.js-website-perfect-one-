import fs from 'fs';

const userDir = 'C:/Users/FINPROV/.gemini/antigravity/brain/ead95c60-fb6b-4e68-afad-79efb8792bf3/.user_uploaded';

if (fs.existsSync(userDir)) {
  const files = fs.readdirSync(userDir);
  console.log('User uploaded files in artifact dir:\n', files);
}
