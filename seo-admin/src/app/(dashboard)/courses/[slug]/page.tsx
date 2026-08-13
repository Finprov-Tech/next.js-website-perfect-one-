import { notFound,redirect } from "next/navigation";
import Link from "next/link";
import { TopBar } from "@/components/TopBar";
import { CourseEditor,type CourseDetail } from "@/components/CourseEditor";
import { ApiError,djangoFetch,djangoJson,SessionExpiredError } from "@/lib/api";
type Lookup={id:number;name:string};
async function getCourse(slug:string){try{const r=await djangoFetch(`/api/v1/seo-panel/courses/${slug}/`);if(r.status===404)notFound();if(!r.ok)throw new ApiError(r.status,await r.json().catch(()=>null));return r.json() as Promise<CourseDetail>}catch(e){if(e instanceof SessionExpiredError)redirect('/login');throw e}}
export default async function CoursePage({params}:{params:Promise<{slug:string}>}){const{slug}=await params;const[course,categories,types]=await Promise.all([getCourse(slug),djangoJson<Lookup[]>('/api/v1/seo-panel/course-categories/'),djangoJson<Lookup[]>('/api/v1/seo-panel/course-program-types/')]);return <><TopBar title={String(course.title)}/><main className="flex-1 overflow-y-auto p-6"><Link href="/courses" className="mb-5 inline-block text-sm font-semibold text-cta">← Back to Courses</Link><CourseEditor course={course} categories={categories} programTypes={types}/></main></>}
