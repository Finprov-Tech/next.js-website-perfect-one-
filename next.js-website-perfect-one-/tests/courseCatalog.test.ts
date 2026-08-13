import assert from "node:assert/strict";
import test from "node:test";
import {
  chooseCourseCatalog,
  findCourseInCatalog,
  normalizeDjangoCourse,
  type CourseCatalogCourse,
} from "../src/lib/courseCatalogCore.ts";

const fallback: CourseCatalogCourse[] = [{
  slug: "local-course",
  title: "Local Course",
  category: "Finance",
  programType: "Certification",
  badge: "Certification",
  badgeCls: "local-class",
  duration: "1 Month",
  mode: "Online",
  tool: "Tally",
  shortDesc: "Local fallback",
  heroDesc: "Local fallback detail",
  highlights: [],
  tools: [],
  hiringPartners: [],
  curriculum: [],
  fee: "Free",
}];

const djangoCourse = {
  slug: "local-course",
  aliases: ["legacy-course"],
  title: "Django Course",
  category: "Analytics",
  program_type: "Executive",
  badge: "Executive",
  badge_css_class: "cms-class",
  duration: "3 Months",
  mode: "Hybrid",
  tool_summary: "Power BI",
  short_description: "CMS listing copy",
  hero_description: "CMS detail copy",
  fee_summary: "Rs. 10,000",
  image: "/media/courses/course.webp",
  image_alt: "Editable CMS alt",
  highlights: [{ text: "Hands-on" }],
  curriculum_modules: [{ title: "Module 1", topics: ["Topic 1"] }],
  seo: { seo_title: "CMS SEO", canonical_url: "https://finprov.com/courses/local-course/" },
};

test("normalizes Django fields without changing slugs or canonical URLs", () => {
  const course = normalizeDjangoCourse(djangoCourse, "http://127.0.0.1:8000");
  assert.ok(course);
  assert.equal(course.slug, "local-course");
  assert.equal(course.programType, "Executive");
  assert.equal(course.image, "http://127.0.0.1:8000/media/courses/course.webp");
  assert.equal(course.imageAlt, "Editable CMS alt");
  assert.equal(course.canonicalUrl, "https://finprov.com/courses/local-course/");
  assert.deepEqual(course.curriculum, [{ title: "Module 1", topics: ["Topic 1"] }]);
});

test("overlays a valid Django course onto the exact local primary slug", () => {
  const selected = chooseCourseCatalog([djangoCourse], fallback, "http://127.0.0.1:8000");
  assert.equal(selected.length, fallback.length);
  assert.equal(selected[0].slug, "local-course");
  assert.equal(selected[0].title, "Django Course");
});

test("uses the unchanged local catalog for empty, malformed, or partially invalid responses", () => {
  assert.equal(chooseCourseCatalog([], fallback, "http://127.0.0.1:8000"), fallback);
  assert.equal(chooseCourseCatalog({ error: true }, fallback, "http://127.0.0.1:8000"), fallback);
  assert.equal(chooseCourseCatalog([djangoCourse, { slug: "broken" }], fallback, "http://127.0.0.1:8000"), fallback);
});

test("supports DRF results envelopes and exact alias lookup", () => {
  const selected = chooseCourseCatalog({ results: [djangoCourse] }, fallback, "http://127.0.0.1:8000");
  assert.equal(findCourseInCatalog(selected, "legacy-course")?.slug, "local-course");
  assert.equal(findCourseInCatalog(selected, "unrelated"), undefined);
});

test("keeps unmatched local courses and preserves local order", () => {
  const second = { ...fallback[0], slug: "second-course", title: "Second local course" };
  const local = [...fallback, second];
  const selected = chooseCourseCatalog([djangoCourse], local, "http://127.0.0.1:8000");
  assert.equal(selected.length, 2);
  assert.equal(selected[0].title, "Django Course");
  assert.equal(selected[1], second);
});

test("rejects unknown or duplicate CMS primary slugs atomically", () => {
  const unknown = { ...djangoCourse, slug: "unknown-course" };
  assert.equal(chooseCourseCatalog([unknown], fallback, "http://127.0.0.1:8000"), fallback);
  assert.equal(chooseCourseCatalog([djangoCourse, djangoCourse], fallback, "http://127.0.0.1:8000"), fallback);
});
