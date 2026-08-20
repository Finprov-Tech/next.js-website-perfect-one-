const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const coursesFilePath = path.join(__dirname, '..', 'src', 'data', 'courses.ts');
let coursesTs = fs.readFileSync(coursesFilePath, 'utf8');

const coursesMatch = coursesTs.match(/export const courses: Course\[\] = (\[[\s\S]*?\]);/);
if (!coursesMatch) {
  console.error('Could not parse courses.ts');
  process.exit(1);
}

let courses = JSON.parse(coursesMatch[1]);
console.log(`Starting official image download for ${courses.length} courses...`);

const targetDir = path.join(__dirname, '..', 'src', 'assets', 'course-images');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

function fetchUrl(url) {
  return new Promise((resolve) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return resolve(fetchUrl(res.headers.location));
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', () => resolve(''));
  });
}

function downloadBinary(url, destPath) {
  return new Promise((resolve) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return resolve(downloadBinary(res.headers.location, destPath));
      }
      if (res.statusCode !== 200) return resolve(false);
      const fileStream = fs.createWriteStream(destPath);
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        resolve(true);
      });
    }).on('error', () => resolve(false));
  });
}

async function processCourses() {
  let downloadedCount = 0;

  for (let i = 0; i < courses.length; i++) {
    const c = courses[i];
    const localFileName = `${c.slug}.jpg`;
    const localPath = path.join(targetDir, localFileName);
    const assetPath = `/src/assets/course-images/${localFileName}`;

    console.log(`[${i + 1}/${courses.length}] Fetching image for ${c.title}...`);

    // Try fetching course page
    const pageUrl = `https://finprov.com/courses/${c.slug}/`;
    const html = await fetchUrl(pageUrl);

    // Find og:image or featured image
    let imageUrl = '';
    const ogMatch = html.match(/<meta property="og:image" content="([^"]+)"/i);
    if (ogMatch && ogMatch[1] && !ogMatch[1].includes('finprov-logo')) {
      imageUrl = ogMatch[1];
    } else {
      const imgMatch = html.match(/<img[^>]+src="([^"]+)"[^>]*class="[^"]*wp-post-image[^"]*"/i) ||
                       html.match(/<img[^>]+src="([^"]+)"[^>]*>/i);
      if (imgMatch && imgMatch[1]) {
        imageUrl = imgMatch[1];
      }
    }

    if (imageUrl) {
      console.log(` -> Found official image URL: ${imageUrl}`);
      const success = await downloadBinary(imageUrl, localPath);
      if (success) {
        c.image = assetPath;
        downloadedCount++;
        console.log(` -> Saved to ${localPath}`);
      } else {
        console.log(` -> Failed to download binary image from ${imageUrl}`);
      }
    } else {
      console.log(` -> No specific image found on page, keeping fallback.`);
    }
  }

  // Update courses.ts
  const newTsContent = coursesTs.replace(coursesMatch[1], JSON.stringify(courses, null, 2));
  fs.writeFileSync(coursesFilePath, newTsContent, 'utf8');
  console.log(`\nDownload completed! Downloaded ${downloadedCount} official course images from Finprov.`);
}

processCourses().catch(err => console.error('Error:', err));
