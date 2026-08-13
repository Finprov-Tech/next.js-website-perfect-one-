import { courses as localCourses } from "@/data/courses";
import {
  chooseCourseCatalog,
  findCourseInCatalog,
  normalizeDjangoCourse,
  type CourseCatalogCourse,
} from "@/lib/courseCatalogCore";

const CMS_ORIGIN = process.env.NEXT_PUBLIC_CMS_API_URL || "http://127.0.0.1:8000";
const COURSES_ENDPOINT = `${CMS_ORIGIN}/api/v1/courses/`;

export async function getCourseCatalog(): Promise<CourseCatalogCourse[]> {
  try {
    const response = await fetch(COURSES_ENDPOINT, { cache: "no-store" });
    if (!response.ok) return localCourses;
    return chooseCourseCatalog(await response.json(), localCourses, CMS_ORIGIN);
  } catch {
    return localCourses;
  }
}

export async function getCourseBySlugDualRead(slug: string): Promise<CourseCatalogCourse | undefined> {
  try {
    const response = await fetch(`${COURSES_ENDPOINT}${encodeURIComponent(slug)}/`, { cache: "no-store" });
    if (response.ok) {
      const course = normalizeDjangoCourse(await response.json(), CMS_ORIGIN);
      if (course) return course;
    }
  } catch {
    // The local lookup below is the production availability fallback.
  }
  return findCourseInCatalog(localCourses, slug);
}

export type { CourseCatalogCourse } from "@/lib/courseCatalogCore";
