import assert from "node:assert/strict";
import test from "node:test";

import {
  appendPublishedCourses,
  publishedCourseEntries,
  type SitemapCourse,
} from "../src/lib/courseSitemapCore.ts";

const SITE_URL = "https://finprov.com";
const course = (
  slug: string,
  status: SitemapCourse["status"] = "draft",
  is_active = true,
): SitemapCourse => ({ slug, status, is_active });

test("70 draft courses produce zero course URLs", () => {
  const drafts = Array.from({ length: 70 }, (_, index) => course(`draft-course-${index + 1}`));
  assert.deepEqual(publishedCourseEntries(drafts, SITE_URL), []);
});

test("one published active course produces exactly one unchanged primary-slug URL", () => {
  const entries = publishedCourseEntries([course("ifrs-course", "published")], SITE_URL);
  assert.deepEqual(entries.map((entry) => entry.url), ["https://finprov.com/courses/ifrs-course/"]);
});

test("mixed published, draft, archived, and inactive courses include only published active courses", () => {
  const entries = publishedCourseEntries([
    course("published-course", "published"),
    course("draft-course"),
    course("archived-course", "archived"),
    course("inactive-published-course", "published", false),
  ], SITE_URL);
  assert.deepEqual(entries.map((entry) => entry.url), ["https://finprov.com/courses/published-course/"]);
});

test("no published courses produce no course URLs", () => {
  assert.equal(publishedCourseEntries([], SITE_URL).length, 0);
});

test("source failure is represented by an empty fail-closed course collection", () => {
  const localDraftCourses = Array.from({ length: 70 }, (_, index) => course(`local-draft-${index + 1}`));
  const failedApiResult: SitemapCourse[] = [];
  assert.equal(publishedCourseEntries(failedApiResult, SITE_URL).length, 0);
  assert.equal(localDraftCourses.length, 70);
});

test("adding published courses preserves every existing non-course sitemap entry", () => {
  const existing = [
    { url: "https://finprov.com/", changeFrequency: "daily" as const, priority: 1 },
    { url: "https://finprov.com/about/", changeFrequency: "weekly" as const, priority: 0.6 },
    { url: "https://finprov.com/blog/example/", changeFrequency: "monthly" as const, priority: 0.5 },
  ];
  const result = appendPublishedCourses(existing, [course("ifrs-course", "published")], SITE_URL);
  assert.deepEqual(result.slice(0, existing.length), existing);
  assert.equal(result.at(-1)?.url, "https://finprov.com/courses/ifrs-course/");
});
