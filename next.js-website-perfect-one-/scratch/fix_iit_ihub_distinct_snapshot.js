import fs from 'fs';

let coursesTs = fs.readFileSync('src/data/courses.ts', 'utf8');

const slug = "iit-ihub-certified-digital-marketing-program";
const slugIndex = coursesTs.indexOf(`"${slug}"`);

if (slugIndex !== -1) {
  const start = coursesTs.lastIndexOf('{', slugIndex);
  let depth = 0, i = start;

  while (i < coursesTs.length) {
    if (coursesTs[i] === '{') depth++;
    else if (coursesTs[i] === '}') {
      depth--;
      if (depth === 0) {
        let block = coursesTs.substring(start, i + 1);

        const heroDesc = "Are you looking for an industry-focused course that can land you a high-profile job? Our Advanced Digital Marketing Course with Generative AI integration is designed just for you! You'll receive a joint certification from IIT Palakkad Technology IHub and Finprov Learning, adding massive value to your resume. This is an opportunity to learn SEO, social media, PPC, Social media marketing, Email marketing, Content marketing, and more through practical training with full placement support.";

        const snapshotText = "This 6-month Digital Marketing Program, available offline and online, helps learners understand and apply today's marketing tactics and tools. By joining our digital marketing training institute, you'll learn about SEO, Search Engine Marketing (SEM), Email marketing, social media marketing, generative AI in marketing and automation, Analytics and optimisation to gain hands-on skills. By the end of the course, there is also a final capstone project for students that enables practical exposure to digital marketing tools and techniques. An authorised joint certification from IIT Palakkad Technology IHub and Finprov Learning helps you stand out in a competitive job market.";

        block = block
          .replace(/"heroDesc":\s*"(?:[^"\\]|\\.)*"/s, `"heroDesc": ${JSON.stringify(heroDesc)}`)
          .replace(/"snapshotText":\s*"(?:[^"\\]|\\.)*"/s, `"snapshotText": ${JSON.stringify(snapshotText)}`);

        coursesTs = coursesTs.substring(0, start) + block + coursesTs.substring(i + 1);
        console.log('✓ Successfully updated IIT IHub course with distinct heroDesc and snapshotText!');
        break;
      }
    }
    i++;
  }
}

fs.writeFileSync('src/data/courses.ts', coursesTs, 'utf8');
