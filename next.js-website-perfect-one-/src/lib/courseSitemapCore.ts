export type SitemapEntry = {
  url: string;
  changeFrequency?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: number;
};

export type SitemapCourse = {
  slug: string;
  status: "published" | "draft" | "archived";
  is_active: boolean;
};

export function publishedCourseEntries(courses: SitemapCourse[], siteUrl: string): SitemapEntry[] {
  return courses
    .filter((course) => course.status === "published" && course.is_active && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(course.slug))
    .map((course) => ({
      url: `${siteUrl}/courses/${course.slug}/`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
}

export function appendPublishedCourses(
  nonCourseEntries: SitemapEntry[],
  courses: SitemapCourse[],
  siteUrl: string,
): SitemapEntry[] {
  return [...nonCourseEntries, ...publishedCourseEntries(courses, siteUrl)];
}
