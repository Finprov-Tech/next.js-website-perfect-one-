const cp = require("child_process");
const fs = require("fs");
const ts = require("typescript");
const vm = require("vm");

function loadCourses() {
  const source = fs.readFileSync("src/data/courses.ts", "utf8");
  const compiled = ts.transpileModule(
    `${source}\n(globalThis).__courses = courses;`,
    {
      compilerOptions: {
        target: ts.ScriptTarget.ES2022,
        module: ts.ModuleKind.CommonJS,
      },
    },
  ).outputText;
  const context = { exports: {} };
  vm.runInNewContext(compiled, context);
  return context.__courses;
}

function cleanText(value) {
  return value
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&amp;|&#038;/gi, "&")
    .replace(/&quot;|&#8220;|&#8221;/gi, '"')
    .replace(/&#8217;|&rsquo;/gi, "’")
    .replace(/&#8211;|&ndash;/gi, "–")
    .replace(/&#8212;|&mdash;/gi, "—")
    .replace(/&#039;|&apos;/gi, "'")
    .replace(/&hellip;|&#8230;/gi, "…")
    .replace(/\s+/g, " ")
    .trim();
}

function extractSnapshot(html) {
  const markers = [...html.matchAll(/Course(?:\s|<[^>]+>)*Snapshot/gi)];
  for (const marker of markers) {
    const section = html.slice(marker.index, marker.index + 30000);
    const paragraphs = [...section.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)]
      .map((match) => cleanText(match[1]))
      .filter(
        (text) =>
          text.length >= 70 &&
          !text.includes("Advanced Certificate Program in Generative AI") &&
          !text.includes("people have already applied") &&
          !text.includes("application journey is simple"),
      );
    if (paragraphs.length) return paragraphs[0];
  }
  return "";
}

const live = JSON.parse(
  fs.readFileSync("scratch/live_catalogue_inventory.json", "utf8"),
).unique;
const liveBySlug = new Map(live.map((course) => [course.slug, course]));
const courses = loadCourses();
const outputPath = "scratch/exact_live_snapshots_70.json";
const results = fs.existsSync(outputPath)
  ? JSON.parse(fs.readFileSync(outputPath, "utf8"))
  : {};

for (const [index, course] of courses.entries()) {
  if (results[course.slug]?.snapshotText) {
    console.log(`[${index + 1}/70] ${course.slug} (cached)`);
    continue;
  }
  const canonicalSlug = course.canonicalUrl
    ?.split("/")
    .filter(Boolean)
    .at(-1);
  const routeCandidates = [
    canonicalSlug,
    course.slug,
    ...(course.aliases || []),
  ].filter(Boolean);
  const liveCourse = routeCandidates
    .map((slug) => liveBySlug.get(slug))
    .find(Boolean);
  if (!liveCourse) {
    throw new Error(`No live catalogue URL found for ${course.slug}`);
  }

  const html = cp.execFileSync("curl.exe", ["-L", "-s", liveCourse.url], {
    encoding: "utf8",
    maxBuffer: 20 * 1024 * 1024,
  });
  const snapshotText = extractSnapshot(html);
  if (!snapshotText) {
    const cachedSources = [
      "scratch/perfect_live_texts.json",
      "scratch/100_percent_exact_course_texts.json",
    ].map((path) => JSON.parse(fs.readFileSync(path, "utf8")));
    const cached = cachedSources
      .map((source) => source[liveCourse.slug]?.snapshotText)
      .find(
        (text) =>
          text &&
          text.length >= 70 &&
          !text.includes("Advanced Certificate Program in Generative AI") &&
          !text.startsWith("Kochi, Vytilla"),
      );
    if (!cached) {
      throw new Error(`No Course Snapshot paragraph found at ${liveCourse.url}`);
    }
    results[course.slug] = {
      sourceUrl: liveCourse.url,
      sourceSlug: liveCourse.slug,
      snapshotText: cached,
    };
    fs.writeFileSync(outputPath, JSON.stringify(results, null, 2), "utf8");
    console.log(
      `[${index + 1}/70] ${course.slug} <- ${liveCourse.slug} (verified cache, ${cached.length})`,
    );
    continue;
  }
  results[course.slug] = {
    sourceUrl: liveCourse.url,
    sourceSlug: liveCourse.slug,
    snapshotText,
  };
  console.log(
    `[${index + 1}/70] ${course.slug} <- ${liveCourse.slug} (${snapshotText.length})`,
  );
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2), "utf8");
}

fs.writeFileSync(
  outputPath,
  JSON.stringify(results, null, 2),
  "utf8",
);
console.log("Saved 70 exact live Course Snapshot paragraphs.");
