const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const uploadedDir = 'C:\\Users\\FINPROV\\.gemini\\antigravity\\brain\\ead95c60-fb6b-4e68-afad-79efb8792bf3\\.user_uploaded';
const targetDir = path.join(__dirname, '..', 'src', 'assets', 'course-images');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const screenshots = [
  'media__1784963214714.png',
  'media__1784963229052.png',
  'media__1784963244211.png',
  'media__1784963259500.png',
  'media__1784963274704.png'
];

const coursesFilePath = path.join(__dirname, '..', 'src', 'data', 'courses.ts');
let coursesTs = fs.readFileSync(coursesFilePath, 'utf8');
const coursesMatch = coursesTs.match(/export const courses: Course\[\] = (\[[\s\S]*?\]);/);
let courses = JSON.parse(coursesMatch[1]);

async function cropAllScreenshots() {
  console.log(`Starting sharp screenshot image cropper for ${courses.length} courses...`);

  let courseIdx = 0;

  for (let shotIdx = 0; shotIdx < screenshots.length; shotIdx++) {
    const shotFile = screenshots[shotIdx];
    const shotPath = path.join(uploadedDir, shotFile);
    if (!fs.existsSync(shotPath)) {
      console.error(`Screenshot ${shotFile} missing!`);
      continue;
    }

    const metadata = await sharp(shotPath).metadata();
    const width = metadata.width;
    const height = metadata.height;
    console.log(`\nProcessing Screenshot #${shotIdx + 1}: ${shotFile} (${width}x${height})`);

    const colWidth = width / 3;
    const rowHeight = height / 5;

    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 3; col++) {
        if (courseIdx >= courses.length) break;

        const c = courses[courseIdx];
        const slug = c.slug;

        // Crop coordinates for course thumbnail inside card
        const left = Math.round(col * colWidth + colWidth * 0.05);
        const top = Math.round(row * rowHeight + rowHeight * 0.015);
        const cropWidth = Math.round(colWidth * 0.90);
        const cropHeight = Math.round(rowHeight * 0.40);

        const outFilename = `${slug}.jpg`;
        const destPath = path.join(targetDir, outFilename);
        const assetPath = `/src/assets/course-images/${outFilename}`;

        await sharp(shotPath)
          .extract({ left, top, width: cropWidth, height: cropHeight })
          .jpeg({ quality: 92 })
          .toFile(destPath);

        c.image = assetPath;
        console.log(` -> [${courseIdx + 1}/70] Cropped exact image for ${c.title} -> ${outFilename}`);
        courseIdx++;
      }
    }
  }

  // Update courses.ts
  const newTsContent = coursesTs.replace(coursesMatch[1], JSON.stringify(courses, null, 2));
  fs.writeFileSync(coursesFilePath, newTsContent, 'utf8');

  console.log(`\nSUCCESS! Extracted all ${courses.length} exact course thumbnail images from user screenshots!`);
}

cropAllScreenshots().catch(err => console.error('Error:', err));
