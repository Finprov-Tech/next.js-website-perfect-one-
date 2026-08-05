/**
 * Helper to smoothly scroll to any section by ID or hash string.
 * Supports Lenis smooth scroll engine when active, falling back to window.scrollTo.
 */
export function scrollToSection(sectionId: string, headerOffset = 96) {
  const cleanId = sectionId.replace(/^#/, "");
  if (!cleanId) return;

  const section = document.getElementById(cleanId);
  if (!section) return;

  const lenis = (window as any).__lenis;
  if (lenis && typeof lenis.scrollTo === "function") {
    lenis.scrollTo(section, { offset: -headerOffset, duration: 1.1 });
  } else {
    const targetY = Math.max(0, section.getBoundingClientRect().top + window.scrollY - headerOffset);
    window.scrollTo({
      top: targetY,
      behavior: "smooth",
    });
  }
}

/**
 * Helper to smoothly scroll to the top of the page.
 */
export function scrollToTop() {
  const lenis = (window as any).__lenis;
  if (lenis && typeof lenis.scrollTo === "function") {
    lenis.scrollTo(0, { duration: 1.1 });
  } else {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }
}
