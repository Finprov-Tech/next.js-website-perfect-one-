/** Build table-of-contents entries from CMS blog sections (headings + in-body h2/h3). */

export type TocEntry = { heading: string; id: string };

function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "section";
}

function uniqueId(base: string, used: Set<string>): string {
  let id = base || "section";
  let n = 1;
  while (used.has(id)) {
    id = `${base}-${n++}`;
  }
  used.add(id);
  return id;
}

export function buildTocEntries(sections: { heading: string; body: string }[]): TocEntry[] {
  const items: TocEntry[] = [];
  const usedIds = new Set<string>();
  const seenHeadings = new Set<string>();

  const add = (heading: string, idBase: string) => {
    const text = heading.trim();
    if (!text || seenHeadings.has(text.toLowerCase())) return;
    seenHeadings.add(text.toLowerCase());
    items.push({ heading: text, id: uniqueId(slugify(idBase || text), usedIds) });
  };

  sections.forEach((section, index) => {
    const titled = section.heading.trim();
    if (titled) {
      add(titled, titled);
    } else if (index === 0 && section.body.trim()) {
      add("Introduction", "introduction");
    }

    const re = /<h([23])[^>]*>([\s\S]*?)<\/h\1>/gi;
    let match: RegExpExecArray | null;
    while ((match = re.exec(section.body)) !== null) {
      add(stripTags(match[2]), stripTags(match[2]));
    }
  });

  return items;
}

/** Inject id attributes on h2/h3 so TOC anchor links work. */
export function injectHeadingIds(html: string, entries: TocEntry[]): string {
  if (!html || entries.length === 0) return html;

  const byHeading = new Map(entries.map((e) => [e.heading.toLowerCase(), e.id]));
  let fallback = 0;

  return html.replace(/<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi, (full, level, attrs, inner) => {
    if (/\bid\s*=/.test(attrs)) return full;
    const text = stripTags(inner);
    const id = byHeading.get(text.toLowerCase()) ?? `section-heading-${fallback++}`;
    return `<h${level}${attrs} id="${id}">${inner}</h${level}>`;
  });
}

export function sectionWrapperId(heading: string, index: number): string {
  const base = slugify(heading);
  return base || `section-${index}`;
}
