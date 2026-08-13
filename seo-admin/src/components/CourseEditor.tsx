"use client";

import { useMemo, useState } from "react";
import { Check, ChevronDown, FileText, Loader2, Plus, Trash2, TriangleAlert } from "lucide-react";
import { CourseReviewPanel, type ReviewIssue, type ReviewSummary } from "@/components/CourseReviewPanel";
import { RichTextEditor } from "@/components/RichTextEditor";

type Lookup = { id: number; name: string };
type Row = { id?: number; display_order?: number; is_active?: boolean; [key: string]: unknown };
export type CourseDetail = Row & {
  id: number; title: string; slug: string; status: "draft" | "published" | "archived";
  category: number; program_type: number; is_active: boolean; display_order: number;
  image?: string | null; syllabus_pdf?: string | null; aliases: { id: number; slug: string }[];
  highlights: Row[]; tools: Row[]; hiring_partners: Row[]; skills: Row[]; audiences: Row[];
  job_opportunities: Row[]; certifications: Row[]; career_prospects: Row[];
  curriculum_modules: (Row & { title: string; topics: Row[] })[]; faqs: Row[];
  seo?: Row; review_issues: ReviewIssue[]; review_summary: ReviewSummary;
};

const TEXT_LISTS = [
  ["highlights", "Highlights", "highlight"], ["tools", "Tools", "tool"],
  ["hiring_partners", "Hiring partners", "partner"], ["skills", "Skills", "skill"],
  ["audiences", "Intended audience", "audience item"], ["job_opportunities", "Job opportunities", "job opportunity"],
  ["certifications", "Certifications", "certification"], ["career_prospects", "Career prospects", "career prospect"],
] as const;

function clone<T>(value: T): T { return JSON.parse(JSON.stringify(value)) as T; }
function value(course: CourseDetail, key: string) { return String(course[key] ?? ""); }

export function CourseEditor({ course: initialCourse, categories, programTypes }: { course: CourseDetail; categories: Lookup[]; programTypes: Lookup[] }) {
  const [course, setCourse] = useState(() => clone(initialCourse));
  const [baseline, setBaseline] = useState(() => clone(initialCourse));
  const [courseImage, setCourseImage] = useState<File | null>(null);
  const [syllabus, setSyllabus] = useState<File | null>(null);
  const [ogImage, setOgImage] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState("");
  const [publicationBusy, setPublicationBusy] = useState(false);
  const [publicationError, setPublicationError] = useState("");
  const [urlSlug, setUrlSlug] = useState(course.slug);
  const [urlCanonical, setUrlCanonical] = useState(String(course.seo?.canonical_url ?? ""));
  const [syncCanonical, setSyncCanonical] = useState(true);
  const [preserveAlias, setPreserveAlias] = useState(true);
  const [createRedirect, setCreateRedirect] = useState(true);
  const [migrationNote, setMigrationNote] = useState("");
  const dirty = useMemo(() => JSON.stringify(course) !== JSON.stringify(baseline) || !!courseImage || !!syllabus || !!ogImage, [course, baseline, courseImage, syllabus, ogImage]);
  const deletedCount = useMemo(() => TEXT_LISTS.reduce((n, [key]) => n + Math.max(0, baseline[key].length - course[key].length), 0)
    + Math.max(0, baseline.curriculum_modules.length - course.curriculum_modules.length)
    + Math.max(0, baseline.curriculum_modules.reduce((n,m)=>n+m.topics.length,0) - course.curriculum_modules.reduce((n,m)=>n+m.topics.length,0))
    + Math.max(0, baseline.faqs.length - course.faqs.length), [course, baseline]);

  function setField(key: string, next: unknown) { setCourse(prev => ({ ...prev, [key]: next })); setStatus("idle"); }
  function updateList(key: typeof TEXT_LISTS[number][0], index: number, next: Row) {
    setCourse(prev => ({ ...prev, [key]: (prev[key] as Row[]).map((row, i) => i === index ? next : row) })); setStatus("idle");
  }
  function removeList(key: typeof TEXT_LISTS[number][0], index: number) {
    setCourse(prev => ({ ...prev, [key]: (prev[key] as Row[]).filter((_, i) => i !== index) })); setStatus("idle");
  }
  function addList(key: typeof TEXT_LISTS[number][0]) { setCourse(prev => ({ ...prev, [key]: [...(prev[key] as Row[]), { text: "", is_active: true }] })); }
  function moveList(key: typeof TEXT_LISTS[number][0], index: number, direction: -1 | 1) { setField(key, move(course[key] as Row[], index, direction)); }

  async function save() {
    if (deletedCount && !window.confirm(`Save changes and permanently delete ${deletedCount} removed nested item${deletedCount === 1 ? "" : "s"}?`)) return;
    setStatus("saving"); setError("");
    const editable = ["title","category","program_type","badge","duration","mode","tool_summary","short_description","hero_description","snapshot_text","online_fees","offline_fees","fee_summary","eligibility","hours_of_learning","industry_projects","tools_used_stat","image_alt","syllabus_button_text"];
    const payload: Record<string, unknown> = Object.fromEntries(editable.map(key => [key, course[key]]));
    for (const [key] of TEXT_LISTS) payload[key] = course[key];
    payload.curriculum_modules = course.curriculum_modules;
    payload.faqs = course.faqs;
    payload.seo = course.seo ? Object.fromEntries(["seo_title","meta_description","og_title","og_description","og_image_alt"].map(key => [key, course.seo?.[key] ?? ""])) : {};
    const body = new FormData(); body.append("payload", JSON.stringify(payload));
    if (courseImage) body.append("image", courseImage);
    if (syllabus) body.append("syllabus_pdf", syllabus);
    if (ogImage) body.append("og_image", ogImage);
    try {
      const response = await fetch(`/api/proxy/courses/${course.slug}/content`, { method: "PATCH", body });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(summarize(data));
      const saved = data as CourseDetail; setCourse(clone(saved)); setBaseline(clone(saved));
      setCourseImage(null); setSyllabus(null); setOgImage(null); setStatus("saved");
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Save failed."); setStatus("error"); }
  }

  async function changePublication(action: "publish" | "unpublish") {
    const verb = action === "publish" ? "publish" : "return to draft";
    if (dirty) { setPublicationError("Save your content changes before changing publication status."); return; }
    if (!window.confirm(`Are you sure you want to ${verb} this complete course?`)) return;
    setPublicationBusy(true); setPublicationError("");
    try {
      const response = await fetch(`/api/proxy/courses/${course.slug}/${action}`, { method: "POST" });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(summarize(data));
      const saved = data as CourseDetail;
      setCourse(clone(saved)); setBaseline(clone(saved));
    } catch (caught) {
      setPublicationError(caught instanceof Error ? caught.message : "Publication update failed.");
    } finally { setPublicationBusy(false); }
  }

  async function keepCurrentUrl() {
    if (!window.confirm(`Keep /courses/${course.slug}/ as the official URL and update the canonical to match? No alias or redirect will change.`)) return;
    setPublicationBusy(true); setPublicationError("");
    try {
      const response = await fetch(`/api/proxy/courses/${course.slug}/url-decision/keep-current`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirmation: "KEEP_CURRENT_URL" }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(summarize(data));
      const saved = data as CourseDetail;
      setCourse(clone(saved)); setBaseline(clone(saved));
    } catch (caught) {
      setPublicationError(caught instanceof Error ? caught.message : "URL decision failed.");
    } finally { setPublicationBusy(false); }
  }

  function changeUrlSlug(next: string) {
    const normalized = next.toLowerCase().trim().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "");
    setUrlSlug(normalized);
    if (syncCanonical) setUrlCanonical(`https://finprov.com/courses/${normalized}/`);
  }

  async function applyUrlMigration() {
    if (dirty) { setPublicationError("Save content changes before changing the URL."); return; }
    if (migrationNote.trim().length < 5) { setPublicationError("Enter a short URL migration note."); return; }
    if (!window.confirm(`Change the course URL from /courses/${course.slug}/ to /courses/${urlSlug}/?`)) return;
    setPublicationBusy(true); setPublicationError("");
    try {
      const response = await fetch(`/api/proxy/courses/${course.slug}/url-migration`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ primary_slug:urlSlug, canonical_url:urlCanonical, preserve_old_slug_as_alias:preserveAlias, create_redirect:createRedirect, migration_note:migrationNote, confirmation:"APPLY_URL_CHANGE" }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(summarize(data));
      const saved = data as CourseDetail;
      window.location.href = `/courses/${saved.slug}`;
    } catch (caught) {
      setPublicationError(caught instanceof Error ? caught.message : "URL migration failed.");
      setPublicationBusy(false);
    }
  }

  const ownership = course.review_issues.filter(issue => issue.category === "ownership");
  return <div className="mx-auto max-w-6xl space-y-5 pb-24">
    <header className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-wide text-cta">Course editor</p><h1 className="mt-1 text-2xl font-extrabold text-navy">{course.title}</h1><p className="mt-1 font-mono text-sm text-text-body">{course.slug}</p></div><span className="rounded-full bg-bg-light px-3 py-1 text-sm font-bold capitalize text-navy">{course.status}</span></div>
    </header>
    <CourseReviewPanel issues={course.review_issues} summary={course.review_summary}/>

    <Section title="Course information">
      <Grid><Input label="Title" value={value(course,"title")} onChange={v=>setField("title",v)}/><Select label="Category" value={String(course.category)} options={categories} onChange={v=>setField("category",Number(v))}/><Select label="Program type" value={String(course.program_type)} options={programTypes} onChange={v=>setField("program_type",Number(v))}/><Input label="Badge" value={value(course,"badge")} onChange={v=>setField("badge",v)}/><Input label="Duration" value={value(course,"duration")} onChange={v=>setField("duration",v)}/><Input label="Mode" value={value(course,"mode")} onChange={v=>setField("mode",v)}/></Grid>
      <TextArea label="Tool summary" value={value(course,"tool_summary")} onChange={v=>setField("tool_summary",v)}/><TextArea label="Short description" value={value(course,"short_description")} onChange={v=>setField("short_description",v)}/><Rich label="Hero description" value={value(course,"hero_description")} onChange={v=>setField("hero_description",v)}/><Rich label="Snapshot description" value={value(course,"snapshot_text")} onChange={v=>setField("snapshot_text",v)}/>
    </Section>

    <Section title="Media and syllabus"><Grid><FileInput label="Course image" accept="image/*" current={typeof course.image === "string" ? course.image : ""} selected={courseImage} onChange={setCourseImage}/><Input label="Image alt text" value={value(course,"image_alt")} onChange={v=>setField("image_alt",v)}/><FileInput label="Syllabus PDF" accept="application/pdf,.pdf" current={typeof course.syllabus_pdf === "string" ? course.syllabus_pdf : ""} selected={syllabus} onChange={setSyllabus}/><Input label="Syllabus button text" value={value(course,"syllabus_button_text")} onChange={v=>setField("syllabus_button_text",v)}/></Grid></Section>
    <Section title="Fees and course statistics"><Grid>{[["online_fees","Online fees"],["offline_fees","Offline fees"],["fee_summary","Fee summary"],["hours_of_learning","Hours of learning"],["industry_projects","Industry projects"],["tools_used_stat","Tools-used statistic"]].map(([key,label])=><Input key={key} label={label} value={value(course,key)} onChange={v=>setField(key,v)}/>)}</Grid><Rich label="Eligibility" value={value(course,"eligibility")} onChange={v=>setField("eligibility",v)}/></Section>

    {TEXT_LISTS.map(([key, label, singular]) => <Section key={key} title={label}><div className="space-y-2">{(course[key] as Row[]).map((row,index)=><RowEditor key={String(row.id ?? `new-${index}`)} value={String(row.text??"")} active={row.is_active !== false} onValue={text=>updateList(key,index,{...row,text})} onActive={is_active=>updateList(key,index,{...row,is_active})} onRemove={()=>removeList(key,index)} onUp={()=>moveList(key,index,-1)} onDown={()=>moveList(key,index,1)} first={index===0} last={index===(course[key] as Row[]).length-1}/>)}</div><AddButton label={`Add ${singular}`} onClick={()=>addList(key)}/></Section>)}

    <Section title="Curriculum"><div className="space-y-4">{course.curriculum_modules.map((module,moduleIndex)=><div key={String(module.id??`new-${moduleIndex}`)} className="rounded-xl border border-border bg-bg-light/40 p-4"><div className="flex gap-2"><Input label={`Module ${moduleIndex+1}`} value={String(module.title??"")} onChange={title=>setField("curriculum_modules",course.curriculum_modules.map((m,i)=>i===moduleIndex?{...m,title}:m))}/><MoveButtons first={moduleIndex===0} last={moduleIndex===course.curriculum_modules.length-1} onUp={()=>setField("curriculum_modules",move(course.curriculum_modules,moduleIndex,-1))} onDown={()=>setField("curriculum_modules",move(course.curriculum_modules,moduleIndex,1))}/><IconDelete label="Remove module" onClick={()=>setField("curriculum_modules",course.curriculum_modules.filter((_,i)=>i!==moduleIndex))}/></div><div className="ml-4 mt-3 space-y-2">{module.topics.map((topic,topicIndex)=><RowEditor key={String(topic.id??`new-${topicIndex}`)} value={String(topic.text??"")} active={topic.is_active!==false} onValue={text=>setField("curriculum_modules",course.curriculum_modules.map((m,i)=>i===moduleIndex?{...m,topics:m.topics.map((t,j)=>j===topicIndex?{...t,text}:t)}:m))} onActive={is_active=>setField("curriculum_modules",course.curriculum_modules.map((m,i)=>i===moduleIndex?{...m,topics:m.topics.map((t,j)=>j===topicIndex?{...t,is_active}:t)}:m))} onRemove={()=>setField("curriculum_modules",course.curriculum_modules.map((m,i)=>i===moduleIndex?{...m,topics:m.topics.filter((_,j)=>j!==topicIndex)}:m))} onUp={()=>setField("curriculum_modules",course.curriculum_modules.map((m,i)=>i===moduleIndex?{...m,topics:move(m.topics,topicIndex,-1)}:m))} onDown={()=>setField("curriculum_modules",course.curriculum_modules.map((m,i)=>i===moduleIndex?{...m,topics:move(m.topics,topicIndex,1)}:m))} first={topicIndex===0} last={topicIndex===module.topics.length-1}/>)}</div><AddButton label="Add topic" onClick={()=>setField("curriculum_modules",course.curriculum_modules.map((m,i)=>i===moduleIndex?{...m,topics:[...m.topics,{text:"",is_active:true}]}:m))}/></div>)}</div><AddButton label="Add curriculum module" onClick={()=>setField("curriculum_modules",[...course.curriculum_modules,{title:"",topics:[],is_active:true}])}/></Section>

    <Section title="FAQs"><div className="space-y-3">{course.faqs.map((faq,index)=><div key={String(faq.id??`new-${index}`)} className="rounded-xl border border-border p-4"><div className="flex gap-2"><Input label="Question" value={String(faq.question??"")} onChange={question=>setField("faqs",course.faqs.map((f,i)=>i===index?{...f,question}:f))}/><IconDelete label="Remove FAQ" onClick={()=>setField("faqs",course.faqs.filter((_,i)=>i!==index))}/></div><Rich label="Answer" value={String(faq.answer??"")} onChange={answer=>setField("faqs",course.faqs.map((f,i)=>i===index?{...f,answer}:f))}/></div>)}</div><AddButton label="Add FAQ" onClick={()=>setField("faqs",[...course.faqs,{question:"",answer:"",is_active:true}])}/></Section>

    {course.seo && <Section title="SEO and OpenGraph"><Grid><Input label="SEO title" value={String(course.seo.seo_title??"")} onChange={v=>setField("seo",{...course.seo,seo_title:v})}/><Input label="OpenGraph title" value={String(course.seo.og_title??"")} onChange={v=>setField("seo",{...course.seo,og_title:v})}/></Grid><TextArea label="Meta description" value={String(course.seo.meta_description??"")} onChange={v=>setField("seo",{...course.seo,meta_description:v})}/><TextArea label="OpenGraph description" value={String(course.seo.og_description??"")} onChange={v=>setField("seo",{...course.seo,og_description:v})}/><Grid><FileInput label="OpenGraph image" accept="image/*" current={String(course.seo.og_image??"")} selected={ogImage} onChange={setOgImage}/><Input label="OpenGraph image alt" value={String(course.seo.og_image_alt??"")} onChange={v=>setField("seo",{...course.seo,og_image_alt:v})}/></Grid></Section>}

    <Section title="URL and migration — protected"><p className="mb-4 rounded-lg bg-gold/10 p-3 text-sm font-semibold text-navy">Changing a public URL is audited and requires confirmation. The application route is /courses/[slug]/.</p><Grid><Input label="Primary slug" value={urlSlug} onChange={changeUrlSlug}/><Input label="Canonical URL" value={urlCanonical} onChange={setUrlCanonical}/><ReadOnly label="Aliases" value={course.aliases.map(alias=>alias.slug).join(", ")||"None"}/><ReadOnly label="Ownership" value={ownership.length ? ownership.map(issue=>`${issue.status}: ${issue.summary}`).join("; ") : "No ownership issue"}/><ReadOnly label="Publication" value={course.status}/><ReadOnly label="Active state" value={course.is_active?"Active":"Inactive"}/></Grid><div className="grid gap-2 text-sm text-navy md:grid-cols-3"><label><input type="checkbox" checked={syncCanonical} onChange={e=>{setSyncCanonical(e.target.checked);if(e.target.checked)setUrlCanonical(`https://finprov.com/courses/${urlSlug}/`)}}/> Keep canonical synchronized</label><label><input type="checkbox" checked={preserveAlias} onChange={e=>setPreserveAlias(e.target.checked)}/> Preserve old slug as alias</label><label><input type="checkbox" checked={createRedirect} onChange={e=>setCreateRedirect(e.target.checked)}/> Create permanent 301 redirect</label></div><TextArea label="Required migration note" value={migrationNote} onChange={setMigrationNote}/><div className="flex flex-wrap gap-3">{course.review_issues.some(issue=>issue.category==="url"&&issue.status==="reviewed")&&<button type="button" disabled={publicationBusy||dirty} onClick={keepCurrentUrl} className="rounded-lg bg-emerald px-4 py-2 text-sm font-bold text-white disabled:opacity-40">Approve current URL and align canonical</button>}<button type="button" disabled={publicationBusy||dirty||!urlSlug||!urlCanonical} onClick={applyUrlMigration} className="rounded-lg bg-navy px-4 py-2 text-sm font-bold text-white disabled:opacity-40">Apply URL Change</button></div></Section>

    <div className="sticky bottom-4 z-20 flex flex-wrap items-center justify-end gap-3 rounded-2xl border border-border bg-white/95 p-4 shadow-xl backdrop-blur">
      {publicationError&&<span className="mr-auto flex items-center gap-1 text-sm font-bold text-destructive"><TriangleAlert className="h-4 w-4"/>{publicationError}</span>}
      <button type="button" disabled={!dirty||status==="saving"} onClick={save} className="flex items-center gap-2 rounded-lg bg-cta px-5 py-2.5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-40">{status==="saving"?<Loader2 className="h-4 w-4 animate-spin"/>:<Check className="h-4 w-4"/>}{status==="saving"?"Saving…":"Save Changes"}</button>
      {course.status==="draft"&&<button type="button" disabled={publicationBusy||dirty} onClick={()=>changePublication("publish")} className="rounded-lg bg-emerald px-5 py-2.5 text-sm font-bold text-white disabled:opacity-40">{publicationBusy?"Publishing…":"Publish Course"}</button>}
      {course.status==="published"&&<button type="button" disabled={publicationBusy||dirty} onClick={()=>changePublication("unpublish")} className="rounded-lg border border-destructive/40 px-5 py-2.5 text-sm font-bold text-destructive disabled:opacity-40">{publicationBusy?"Updating…":"Return to Draft"}</button>}
      {status==="saved"&&<span className="text-sm font-bold text-emerald">Changes saved.</span>}{status==="error"&&<span className="flex items-center gap-1 text-sm font-bold text-destructive"><TriangleAlert className="h-4 w-4"/>{error}</span>}
    </div>
  </div>;
}

function Section({title,children}:{title:string;children:React.ReactNode}) { return <details open className="group rounded-2xl border border-border bg-card p-5 shadow-sm"><summary className="flex cursor-pointer list-none items-center justify-between text-lg font-bold text-navy">{title}<ChevronDown className="h-5 w-5 transition-transform group-open:rotate-180"/></summary><div className="mt-4 space-y-4">{children}</div></details>; }
function Grid({children}:{children:React.ReactNode}) { return <div className="grid gap-4 md:grid-cols-2">{children}</div>; }
function Input({label,value,onChange}:{label:string;value:string;onChange:(v:string)=>void}) { return <label className="block flex-1 text-xs font-semibold text-text-body/80">{label}<input value={value} onChange={e=>onChange(e.target.value)} className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm text-navy focus:border-cta focus:outline-none"/></label>; }
function TextArea({label,value,onChange}:{label:string;value:string;onChange:(v:string)=>void}) { return <label className="block text-xs font-semibold text-text-body/80">{label}<textarea rows={4} value={value} onChange={e=>onChange(e.target.value)} className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm text-navy focus:border-cta focus:outline-none"/></label>; }
function Rich({label,value,onChange}:{label:string;value:string;onChange:(v:string)=>void}) { return <div><label className="mb-1 block text-xs font-semibold text-text-body/80">{label}</label><RichTextEditor value={value} onChange={onChange}/></div>; }
function Select({label,value,options,onChange}:{label:string;value:string;options:Lookup[];onChange:(v:string)=>void}) { return <label className="block text-xs font-semibold text-text-body/80">{label}<select value={value} onChange={e=>onChange(e.target.value)} className="mt-1 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-navy">{options.map(option=><option key={option.id} value={option.id}>{option.name}</option>)}</select></label>; }
function FileInput({label,accept,current,selected,onChange}:{label:string;accept:string;current:string;selected:File|null;onChange:(file:File|null)=>void}) { return <label className="block text-xs font-semibold text-text-body/80">{label}<span className="mt-1 flex min-h-11 items-center gap-3 rounded-lg border border-border px-3 py-2"><FileText className="h-4 w-4 text-cta"/><span className="min-w-0 flex-1 truncate text-xs font-normal">{selected?.name||current||"No file"}</span><input type="file" accept={accept} onChange={e=>onChange(e.target.files?.[0]??null)} className="max-w-48 text-xs"/></span></label>; }
function RowEditor({value,active,onValue,onActive,onRemove,onUp,onDown,first,last}:{value:string;active:boolean;onValue:(v:string)=>void;onActive:(v:boolean)=>void;onRemove:()=>void;onUp:()=>void;onDown:()=>void;first:boolean;last:boolean}) { return <div className="flex items-center gap-2"><input value={value} onChange={e=>onValue(e.target.value)} className="min-w-0 flex-1 rounded-lg border border-border px-3 py-2 text-sm"/><label className="flex items-center gap-1 text-xs"><input type="checkbox" checked={active} onChange={e=>onActive(e.target.checked)}/>Active</label><MoveButtons first={first} last={last} onUp={onUp} onDown={onDown}/><IconDelete label="Remove item" onClick={onRemove}/></div>; }
function MoveButtons({first,last,onUp,onDown}:{first:boolean;last:boolean;onUp:()=>void;onDown:()=>void}) { return <div className="mt-5 flex"><button type="button" disabled={first} title="Move up" onClick={onUp} className="rounded-l border border-border px-2 py-1 text-xs disabled:opacity-25">↑</button><button type="button" disabled={last} title="Move down" onClick={onDown} className="rounded-r border border-l-0 border-border px-2 py-1 text-xs disabled:opacity-25">↓</button></div>; }
function IconDelete({label,onClick}:{label:string;onClick:()=>void}) { return <button type="button" title={label} onClick={onClick} className="mt-5 rounded-lg p-2 text-destructive hover:bg-destructive/10"><Trash2 className="h-4 w-4"/></button>; }
function AddButton({label,onClick}:{label:string;onClick:()=>void}) { return <button type="button" onClick={onClick} className="mt-3 flex items-center gap-1 rounded-lg border border-cta/30 px-3 py-2 text-xs font-bold text-cta"><Plus className="h-4 w-4"/>{label}</button>; }
function ReadOnly({label,value}:{label:string;value:string}) { return <div><div className="text-xs font-semibold text-text-body/70">{label}</div><div className="mt-1 break-words rounded-lg border border-border bg-bg-light px-3 py-2 text-sm text-navy">{value||"—"}</div></div>; }
function summarize(data:unknown) { if(!data||typeof data!=="object")return "Save failed."; const [key,value]=Object.entries(data)[0]??[]; return key?`${key}: ${Array.isArray(value)?value.join(" "):String(value)}`:"Save failed."; }
function move<T>(rows:T[],index:number,direction:-1|1):T[] { const target=index+direction;if(target<0||target>=rows.length)return rows;const next=[...rows];[next[index],next[target]]=[next[target],next[index]];return next; }
