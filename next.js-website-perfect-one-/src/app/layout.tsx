import type { Metadata } from "next";
import "@/styles.css";
import { ClientProviders } from "@/components/providers/ClientProviders";

export const metadata: Metadata = {
  title: "Finprov — Master Finance. Accelerate Your Global Career.",
  description:
    "Industry-validated finance programs with SAP, Tally & Power BI training. 100% placement assistance for freshers and working professionals.",
  authors: [{ name: "Finprov" }],
  openGraph: {
    title: "Finprov — Master Finance. Accelerate Your Global Career.",
    description:
      "Industry-validated finance programs with SAP, Tally & Power BI training. 100% placement assistance for freshers and working professionals.",
    type: "website",
    images: [
      {
        url: "https://finprov.com/finprov-wordmark.jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Finprov — Master Finance. Accelerate Your Global Career.",
    description:
      "Industry-validated finance programs with SAP, Tally & Power BI training. 100% placement assistance for freshers and working professionals.",
    images: ["https://finprov.com/finprov-wordmark.jpeg"],
  },
  icons: {
    icon: "/finprov-mark.jpeg",
    apple: "/finprov-mark.jpeg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
