'use client';

import { createContext, useContext } from "react";
import { courses as localCourses } from "@/data/courses";
import type { CourseCatalogCourse } from "@/lib/courseCatalogCore";

const CourseCatalogContext = createContext<CourseCatalogCourse[]>(localCourses);

export function CourseCatalogProvider({
  courses,
  children,
}: {
  courses: CourseCatalogCourse[];
  children: React.ReactNode;
}) {
  return <CourseCatalogContext.Provider value={courses.length ? courses : localCourses}>{children}</CourseCatalogContext.Provider>;
}

export function useCourseCatalog() {
  return useContext(CourseCatalogContext);
}
