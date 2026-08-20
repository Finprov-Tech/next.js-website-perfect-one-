/** Turns the raw migrated-from-WordPress `LandingPageBody.body` blob into
 * something a template can lay out as real sections instead of one long
 * wall of text.
 *
 * The value this receives has already been through the backend's public
 * read-path sanitizer, which strips any tag outside its allow-list
 * (p/ul/ol/li/strong/em/b/i/u/a/br/h2-h6) but — like most HTML sanitizers —
 * removes only the *tag*, not its inner text. So a WordPress/Elementor FAQ
 * accordion's `<details><summary>Question</summary><p>Answer</p></details>`
 * survives as bare, untagged "Question" text sitting in front of the
 * answer `<p>`, and a plain "Read More" toggle survives the same way. This
 * module reconstructs headings from that pattern and drops the rest of the
 * Elementor debris (stray CTA links, duplicate paragraphs left over from
 * the accordion's expanded/collapsed copies, unresolvable decorative
 * `<img>` clusters). Presentation-only — it never touches the stored HTML. */

export type LandingSection = {
  heading: string | null;
  /** Cleaned, de-duplicated inner HTML (paragraphs/lists/headings only — no images). */
  html: string;
  /** Alt-text names pulled from an image-only section (e.g. a hiring-partner
   * logo row) so it can render as a badge row instead of broken <img>s. */
  badges: string[];
};

const stripTags = (html: string) =>
  html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/\s+/g, " ")
    .trim();

const BLOCK_TAG_SOURCE = "<(p|ul|ol|h[2-6])\\b[^>]*>[\\s\\S]*?<\\/\\1>";
const HAS_TAG_RE = /<[a-z][^>]*>/i;
const GENERIC_TOGGLE_LABEL = /^(read|show|view)\s*more$/i;

/** Text sitting between two recognized blocks is normally just whitespace/
 * layout artifacts and gets dropped. The one case worth keeping: a short
 * run of *bare* text (no tags of its own — a real stray CTA link would
 * still be wrapped in its own `<a>`) immediately before a block — that's
 * what's left of a sanitized-away `<summary>` question, so promote it to
 * a heading. Longer bare runs are more likely stray leftover prose than a
 * real question, so they're left for dedup to deal with. */
function promoteLooseHeadings(html: string): string {
  const re = new RegExp(BLOCK_TAG_SOURCE, "gi");
  const out: string[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = re.exec(html))) {
    const gap = html.slice(lastIndex, match.index);
    if (!HAS_TAG_RE.test(gap)) {
      const text = stripTags(gap);
      if (text && text.length < 200 && !GENERIC_TOGGLE_LABEL.test(text)) out.push(`<h4>${text}</h4>`);
    }
    out.push(match[0]);
    lastIndex = re.lastIndex;
  }
  return out.join("");
}

function extractImgAlts(html: string): string[] {
  const alts: string[] = [];
  const re = /<img[^>]*\balt="([^"]*)"[^>]*>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    const alt = m[1].replace(/\s*(logo|icon)\s*$/i, "").trim();
    if (alt && !/^group\s/i.test(alt)) alts.push(alt);
  }
  return alts;
}

const stripImages = (html: string) => html.replace(/<img[^>]*>/gi, "");

const BLOCK_RE = /<(p|ul|ol|h[2-6])\b[^>]*>[\s\S]*?<\/\1>/gi;

/** Removes blocks whose plain-text content exactly matches one already kept
 * anywhere earlier on the page — the accordion re-renders paragraphs both
 * inside and outside <details>, so exact repeats are import artifacts, not
 * intentional emphasis. `seen` is shared across the whole page. */
/** Comparison key only — normalizes the smart/straight-quote and
 * decoded/undecoded-entity mismatches WordPress content routinely has
 * between duplicate copies of the same sentence (e.g. one copy literally
 * has the text "&#8217;s", the other a real "'s"), without altering what's
 * actually displayed. */
const dedupeKey = (text: string) =>
  text
    .replace(/&#(\d+);/g, (_, dec: string) => String.fromCharCode(parseInt(dec, 10)))
    .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) => String.fromCharCode(parseInt(hex, 16)))
    .toLowerCase()
    .replace(/[‘’ʼ]/g, "'")
    .replace(/[“”]/g, '"');

function dedupeBlocks(html: string, seen: Set<string>): string {
  const blocks = html.match(BLOCK_RE) || [];
  const kept: string[] = [];
  for (const block of blocks) {
    const key = dedupeKey(stripTags(block));
    if (!key || seen.has(key)) continue;
    seen.add(key);
    kept.push(block);
  }
  return kept.join("");
}

const firstParagraphText = (html: string): string | null => {
  const m = html.match(/<p\b[^>]*>[\s\S]*?<\/p>/i);
  return m ? stripTags(m[0]) : null;
};

export function parseLandingContent(rawHtml: string) {
  const html = rawHtml || "";
  const heroLead = firstParagraphText(html);

  const seen = new Set<string>();
  if (heroLead) seen.add(dedupeKey(heroLead));

  const parts = html.split(/(<h2[^>]*>[\s\S]*?<\/h2>)/gi);

  const rawChunks: { heading: string | null; content: string }[] = [];
  if (parts[0] && stripTags(parts[0])) {
    rawChunks.push({ heading: null, content: parts[0] });
  }
  for (let i = 1; i < parts.length; i += 2) {
    const heading = stripTags(parts[i]);
    const content = parts[i + 1] ?? "";
    rawChunks.push({ heading: heading || null, content });
  }

  const sections: LandingSection[] = [];
  for (const chunk of rawChunks) {
    const badges = extractImgAlts(chunk.content); // before images are stripped
    const withoutImages = stripImages(chunk.content);
    const withHeadings = promoteLooseHeadings(withoutImages);
    const dedupedHtml = dedupeBlocks(withHeadings, seen);
    const plainText = stripTags(dedupedHtml);

    if (!plainText && badges.length === 0) continue; // nothing left to show
    sections.push({ heading: chunk.heading, html: plainText ? dedupedHtml : "", badges: plainText ? [] : badges });
  }

  return { heroLead, sections };
}
