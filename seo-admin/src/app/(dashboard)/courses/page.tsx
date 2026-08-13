import { redirect } from "next/navigation";
import { TopBar } from "@/components/TopBar";
import { CoursesTable, type CourseListItem } from "@/components/CoursesTable";
import { djangoJson, SessionExpiredError } from "@/lib/api";

export default async function CoursesPage(){
  let courses:CourseListItem[]=[];try{courses=await djangoJson("/api/v1/seo-panel/courses/")}catch(e){if(e instanceof SessionExpiredError)redirect("/login");throw e}
  return <><TopBar title="Courses"/><main className="flex-1 overflow-y-auto p-6"><CoursesTable courses={courses}/></main></>;
}
