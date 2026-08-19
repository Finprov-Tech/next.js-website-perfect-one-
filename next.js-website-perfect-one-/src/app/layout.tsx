import type { Metadata } from "next";
import "@/styles.css";
import { ClientProviders } from "@/components/providers/ClientProviders";
import { SITE_DEFAULT_DESCRIPTION, SITE_DEFAULT_IMAGE, SITE_DEFAULT_TITLE } from "@/lib/seo";
import { getCourseCatalog } from "@/lib/courseCatalog";
import { Inter, Plus_Jakarta_Sans, Caveat } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-plus-jakarta-sans",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-caveat",
  display: "swap",
});

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
    <html lang="en" className={`${inter.variable} ${plusJakartaSans.variable} ${caveat.variable}`}>
      <body className="antialiased">
        <ClientProviders courseCatalog={courseCatalog}>{children}</ClientProviders>
      </body>
    </html>
  );
}
