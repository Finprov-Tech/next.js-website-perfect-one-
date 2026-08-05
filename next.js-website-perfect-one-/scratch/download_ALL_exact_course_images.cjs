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
console.log(`Starting deep image scraper for all ${courses.length} courses...`);

const targetDir = path.join(__dirname, '..', 'src', 'assets', 'course-images');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

function fetchHtml(url) {
  return new Promise((resolve) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8'
      }
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return resolve(fetchHtml(res.headers.location));
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
    client.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    }, (res) => {
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

function isGenericLogo(url) {
  if (!url) return true;
  const l = url.toLowerCase();
  return l.includes('logo') || l.includes('favicon') || l.includes('icon') || l.includes('avatar') || l.includes('skill-up-rise-up');
}

async function getCourseImageFromFinprov(c) {
  const urlsToTry = [
    `https://finprov.com/courses/${c.slug}/`,
    `https://finprov.com/course/${c.slug}/`,
    `https://finprov.com/${c.slug}/`
  ];

  for (const pageUrl of urlsToTry) {
    const html = await fetchHtml(pageUrl);
    if (!html || html.length < 500) continue;

    // 1. og:image
    const ogMatch = html.match(/<meta property="og:image" content="([^"]+)"/i);
    if (ogMatch && ogMatch[1] && !isGenericLogo(ogMatch[1])) {
      return ogMatch[1];
    }

    // 2. featured wp-post-image
    const wpImgMatch = html.match(/<img[^>]+src="([^"]+)"[^>]*class="[^"]*wp-post-image[^"]*"/i);
    if (wpImgMatch && wpImgMatch[1] && !isGenericLogo(wpImgMatch[1])) {
      return wpImgMatch[1];
    }

    // 3. elementor image or wp-content/uploads image
    const allImgs = Array.from(html.matchAll(/src="([^"]+wp-content\/uploads\/[^"]+)"/gi)).map(m => m[1]);
    for (const imgUrl of allImgs) {
      if (!isGenericLogo(imgUrl) && (imgUrl.endsWith('.png') || imgUrl.endsWith('.jpg') || imgUrl.endsWith('.webp') || imgUrl.endsWith('.jpeg') || imgUrl.endsWith('.gif'))) {
        return imgUrl;
      }
    }
  }

  return null;
}

async function run() {
  let updatedCount = 0;

  for (let i = 0; i < courses.length; i++) {
    const c = courses[i];
    console.log(`[${i + 1}/${courses.length}] Checking official image for: ${c.title} (${c.slug})`);

    const imageUrl = await getCourseImageFromFinprov(c);
    if (imageUrl) {
      const ext = imageUrl.split('.').pop().split('?')[0] || 'jpg';
      const fileName = `${c.slug}.${ext}`;
      const destPath = path.join(targetDir, fileName);
      const assetPath = `/src/assets/course-images/${fileName}`;

      console.log(`  -> Downloading: ${imageUrl}`);
      const ok = await downloadBinary(imageUrl, destPath);
      if (ok) {
        c.image = assetPath;
        updatedCount++;
        console.log(`  -> SUCCESS: Saved to ${destPath}`);
      } else {
        console.log(`  -> Failed to download binary.`);
      }
    } else {
      console.log(`  -> No specific course image found on finprov.com.`);
    }
  }

  // Write updated courses back
  const newTsContent = coursesTs.replace(coursesMatch[1], JSON.stringify(courses, null, 2));
  fs.writeFileSync(coursesFilePath, newTsContent, 'utf8');

  console.log(`\nDONE! Downloaded & updated ${updatedCount} course images from original Finprov website.`);
}

run().catch(err => console.error('Error:', err));
