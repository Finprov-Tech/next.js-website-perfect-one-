const fs = require('fs');
const path = require('path');

const userUploadedDir = 'C:\\Users\\FINPROV\\.gemini\\antigravity\\brain\\ead95c60-fb6b-4e68-afad-79efb8792bf3\\.user_uploaded';

if (fs.existsSync(userUploadedDir)) {
  const files = fs.readdirSync(userUploadedDir);
  console.log("User uploaded media files:", files);
} else {
  console.log("User uploaded directory not found.");
}
