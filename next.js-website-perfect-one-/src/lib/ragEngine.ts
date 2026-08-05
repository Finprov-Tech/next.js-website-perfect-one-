import { courses, Course, getCourseBySlug } from "@/data/courses";

export interface RAGMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  recommendedCourses?: Course[];
  timestamp: string;
}

// Levenshtein distance for fuzzy typo correction (e.g. "marketting" -> "marketing")
function levenshtein(a: string, b: string): number {
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

function isFuzzyMatch(token: string, target: string): boolean {
  if (token === target || target.includes(token) || token.includes(target)) return true;
  if (token.length > 4 && target.length > 4) {
    const dist = levenshtein(token, target);
    return dist <= 2;
  }
  return false;
}

function normalizeWord(w: string): string {
  const lower = w.toLowerCase().trim();
  if (isFuzzyMatch(lower, "marketing") || isFuzzyMatch(lower, "marketting")) return "marketing";
  if (isFuzzyMatch(lower, "accounting") || isFuzzyMatch(lower, "acounting")) return "accounting";
  if (isFuzzyMatch(lower, "tally") || isFuzzyMatch(lower, "taly")) return "tally";
  if (isFuzzyMatch(lower, "excel") || isFuzzyMatch(lower, "excel")) return "excel";
  if (isFuzzyMatch(lower, "analytics") || isFuzzyMatch(lower, "analtyics")) return "analytics";
  return lower;
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !["the", "and", "for", "with", "this", "that", "you", "are", "can", "how", "what", "which", "course", "courses"].includes(w))
    .map(normalizeWord);
}

function calculateSimilarity(queryTokens: string[], docTokens: string[]): number {
  if (queryTokens.length === 0 || docTokens.length === 0) return 0;
  let matchCount = 0;
  for (const qToken of queryTokens) {
    for (const dToken of docTokens) {
      if (isFuzzyMatch(qToken, dToken)) {
        matchCount++;
        break;
      }
    }
  }
  return matchCount / Math.sqrt(queryTokens.length * docTokens.length);
}

export function searchRAG(query: string): { response: string; recommendedCourses: Course[] } {
  const rawTokens = query.toLowerCase().replace(/[^\w\s]/g, " ").split(/\s+/);
  const queryTokens = tokenize(query);

  const isMarketingQuery = rawTokens.some((t) => isFuzzyMatch(t, "marketing") || isFuzzyMatch(t, "marketting") || isFuzzyMatch(t, "seo") || isFuzzyMatch(t, "ppc"));
  const isGulfQuery = rawTokens.some((t) => isFuzzyMatch(t, "gulf") || isFuzzyMatch(t, "uae") || isFuzzyMatch(t, "dubai") || isFuzzyMatch(t, "vat"));
  const isTallyQuery = rawTokens.some((t) => isFuzzyMatch(t, "tally") || isFuzzyMatch(t, "taly") || isFuzzyMatch(t, "gst"));
  const isSapQuery = rawTokens.some((t) => isFuzzyMatch(t, "sap") || isFuzzyMatch(t, "hana") || isFuzzyMatch(t, "fico"));
  const isAnalyticsQuery = rawTokens.some((t) => isFuzzyMatch(t, "analytics") || isFuzzyMatch(t, "excel") || isFuzzyMatch(t, "powerbi"));

  // Score all 70 courses based on title, category, tools, curriculum, description
  const scored = courses.map((course) => {
    const docText = [
      course.title,
      course.category,
      course.tool,
      course.programType,
      course.shortDesc,
      course.heroDesc,
      Array.isArray(course.tools) ? course.tools.join(" ") : String(course.tools),
      Array.isArray(course.highlights) ? course.highlights.join(" ") : String(course.highlights),
    ].join(" ");

    const docTokens = tokenize(docText);
    let score = calculateSimilarity(queryTokens, docTokens);

    // Intent specific boosting & strict domain isolation
    const titleLower = course.title.toLowerCase();
    const catLower = (course.category || "").toLowerCase();

    if (isMarketingQuery) {
      if (catLower.includes("marketing") || titleLower.includes("marketing") || titleLower.includes("seo") || titleLower.includes("ppc")) {
        score += 1.5;
      } else {
        score = 0; // Filter out non-marketing courses
      }
    } else if (isGulfQuery) {
      if (catLower.includes("gulf") || titleLower.includes("gulf") || titleLower.includes("uae") || course.slug.includes("pgdifa") || course.slug.includes("ibap") || course.slug.includes("gaap")) {
        score += 1.2;
      }
    } else if (isSapQuery) {
      if (titleLower.includes("sap") || course.tool.toLowerCase().includes("sap")) {
        score += 1.5;
      } else {
        score = 0;
      }
    } else if (isTallyQuery) {
      if (titleLower.includes("tally") || course.tool.toLowerCase().includes("tally") || titleLower.includes("gst")) {
        score += 1.0;
      }
    } else if (isAnalyticsQuery) {
      if (catLower.includes("analytics") || titleLower.includes("analytics") || titleLower.includes("excel")) {
        score += 1.2;
      }
    }

    return { course, score };
  });

  // Return all top matching relevant courses without 4-course cap
  const topMatches = scored.filter((s) => s.score > 0.15).map((s) => s.course);

  // Fallback to top flagship courses ONLY if query has no specific intent
  const recommendedCourses = topMatches.length > 0 ? topMatches : [
    getCourseBySlug("pg-diploma-in-business-accounting-and-taxation-course-pgbat")!,
    getCourseBySlug("pg-diploma-in-indian-and-foreign-accounting-course-pgdifa")!,
    getCourseBySlug("certified-in-business-accounting-taxation-cbat") || courses[0],
  ].filter(Boolean);

  // Response Text Customization
  let response = "";

  if (isMarketingQuery) {
    response = `Finprov offers specialized **Digital Marketing & Performance Media** programs covering SEO, Google Ads, Social Media Marketing, Meta Ads, and AI-driven growth strategies.\n\nHere are the top Digital Marketing programs:`;
  } else if (isGulfQuery) {
    response = `Finprov offers specialized **Gulf & International Accounting** programs tailored for careers in Dubai, UAE, and GCC countries. They cover UAE Corporate Tax, Gulf VAT, IFRS, Tally Prime, and International Taxation.\n\nHere are the top recommended programs for Gulf careers:`;
  } else if (isTallyQuery) {
    response = `Finprov provides hands-on practical simulation training in **Tally Prime & GST Filing**.\n\nHere are the recommended Tally Prime programs:`;
  } else if (isSapQuery) {
    response = `Finprov is an authorized training partner providing practical **SAP S/4HANA FI & MM** module certifications.\n\nHere are the recommended SAP programs:`;
  } else if (isAnalyticsQuery) {
    response = `Finprov provides hands-on training in **Business Analytics, Data Analytics, and Advanced MS Excel**.\n\nHere are the top recommended Analytics programs:`;
  } else {
    response = `Based on our 70 official course knowledge base, here are the most relevant program recommendations matching your query:`;
  }

  return { response, recommendedCourses };
}
