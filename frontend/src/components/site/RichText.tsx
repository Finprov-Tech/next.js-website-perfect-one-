import { cn } from "@/lib/utils";

type RichTextProps = {
  /** Sanitized HTML from the CMS (bold/italic/underline/lists/links only — see api/serializers.py). */
  html: string | null | undefined;
  className?: string;
  /** 'span' (default) so this can sit inside an existing <p> — most call
   * sites are `<p className="...">{someField}</p>` and swap only the child.
   * Use 'div' for a field that owns its own block container. */
  as?: "span" | "div";
};

/** CMS rich text can contain block tags, while many compact copy placements
 * intentionally render inside an existing paragraph. Browsers re-parent block
 * tags found inside <p>, which causes the hydrated DOM to differ from SSR.
 * Convert block markup to equivalent inline markup for the default span mode;
 * callers using `as="div"` retain the original semantic blocks. */
function toInlineHtml(html: string): string {
  return html
    .replace(/<\/p>\s*<p(?:\s[^>]*)?>/gi, "<br />")
    .replace(/<\/?p(?:\s[^>]*)?>/gi, "")
    .replace(/<h[2-6][^>]*>/gi, "<strong>")
    .replace(/<\/h[2-6]>/gi, "</strong><br />")
    .replace(/<\/?(?:ul|ol)[^>]*>/gi, "")
    .replace(/<li[^>]*>/gi, "• ")
    .replace(/<\/li>/gi, "<br />");
}

/** Renders CMS rich-text fields. Same allowed-tag styling convention as the
 * Privacy Policy / Terms pages (the first fields to support HTML content). */
export function RichText({ html, className, as = "span" }: RichTextProps) {
  const Tag = as;
  const renderedHtml = as === "span" ? toInlineHtml(html ?? "") : (html ?? "");
  return (
    <Tag
      className={cn(
        "[&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-5",
        "[&_strong]:font-semibold [&_b]:font-semibold [&_a]:text-emerald [&_a]:underline [&_a]:underline-offset-2",
        "[&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-navy [&_h2]:mt-6 [&_h2]:mb-2",
        "[&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-navy [&_h3]:mt-5 [&_h3]:mb-2",
        "[&_h4]:text-lg [&_h4]:font-semibold [&_h4]:text-navy [&_h4]:mt-4 [&_h4]:mb-1.5",
        "[&_h5]:text-base [&_h5]:font-semibold [&_h5]:text-navy [&_h5]:mt-3 [&_h5]:mb-1.5",
        "[&_h6]:text-sm [&_h6]:font-semibold [&_h6]:text-navy [&_h6]:mt-3 [&_h6]:mb-1",
        "[&_img]:my-4 [&_img]:block [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-xl [&_img]:border [&_img]:border-border",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: renderedHtml }}
    />
  );
}
