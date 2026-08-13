import type { Metadata } from "next";
import "@/styles.css";
import { ClientProviders } from "@/components/providers/ClientProviders";
import { SITE_DEFAULT_DESCRIPTION, SITE_DEFAULT_IMAGE, SITE_DEFAULT_TITLE } from "@/lib/seo";
import { getCourseCatalog } from "@/lib/courseCatalog";

export const metadata: Metadata = {
  title: SITE_DEFAULT_TITLE,
  description: SITE_DEFAULT_DESCRIPTION,
  authors: [{ name: "Finprov" }],
  openGraph: {
    title: SITE_DEFAULT_TITLE,
    description: SITE_DEFAULT_DESCRIPTION,
    type: "website",
    images: [
      {
        url: SITE_DEFAULT_IMAGE,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_DEFAULT_TITLE,
    description: SITE_DEFAULT_DESCRIPTION,
    images: [SITE_DEFAULT_IMAGE],
  },
  icons: {
    icon: "/finprov-mark.jpeg",
    apple: "/finprov-mark.jpeg",
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const courseCatalog = await getCourseCatalog();
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Caveat:wght@500;600;700&display=swap"
        />
      </head>
      <body className="antialiased">
        <ClientProviders courseCatalog={courseCatalog}>{children}</ClientProviders>
      </body>
    </html>
  );
}
