import Link from "next/link";
import { getSiteSettings, resolveCmsImageUrl } from "@/lib/cms";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

const FALLBACK_TITLE = "Page not found";
const FALLBACK_MESSAGE = "The page you're looking for doesn't exist or may have moved.";

export default async function NotFound() {
  const settings = await getSiteSettings();
  const title = settings?.custom_404_title || FALLBACK_TITLE;
  const message = settings?.custom_404_message || FALLBACK_MESSAGE;
  const image = resolveCmsImageUrl(settings?.custom_404_image);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <section className="mx-auto flex max-w-2xl flex-col items-center px-6 py-24 text-center">
        {image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt="" className="mb-8 max-h-64 w-auto" />
        )}
        <span className="text-sm font-bold uppercase tracking-wider text-teal">404</span>
        <h1 className="mt-3 text-3xl font-extrabold text-navy sm:text-4xl">{title}</h1>
        <p className="mt-4 text-sm text-text-body sm:text-base">{message}</p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gold px-6 py-3 font-bold text-navy shadow-lg transition-all hover:bg-gold-light"
        >
          Back to Home
        </Link>
      </section>
      <SiteFooter />
    </div>
  );
}
