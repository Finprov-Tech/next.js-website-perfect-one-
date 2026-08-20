/** Root-level public URL — matches finprov.com (no /blog/, /courses/, etc.). */
export function slugPath(slug: string): string {
  const clean = slug.replace(/^\/+|\/+$/g, "");
  return `/${clean}/`;
}
