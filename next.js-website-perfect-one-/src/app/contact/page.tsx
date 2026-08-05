'use client';

import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { ContactAdvisors } from "@/components/home/ContactAdvisors";
import { Faq } from "@/components/site/Faq";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <main className="pt-24 sm:pt-28">
        <ContactAdvisors />
      </main>

      <Faq />
      <SiteFooter />
    </div>
  );
}
