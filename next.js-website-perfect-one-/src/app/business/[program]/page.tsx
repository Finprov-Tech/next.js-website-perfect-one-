import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { businessProgramAreas, businessProgramSlug, getBusinessProgram } from "@/data/business";
import { BusinessProgramDetailView } from "@/components/business/BusinessProgramDetailView";

export async function generateStaticParams() {
  const paramsList: { program: string }[] = [];
  businessProgramAreas.forEach((area) => {
    area.programs.forEach((p) => {
      paramsList.push({ program: businessProgramSlug(p) });
    });
  });
  return paramsList;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ program: string }>;
}): Promise<Metadata> {
  const { program: programSlug } = await params;
  const program = getBusinessProgram(programSlug);

  if (!program) {
    return {
      title: "Business Program Not Found | Finprov Business",
    };
  }

  const title = `${program.title} | Finprov Business`;
  const description = program.description;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      siteName: "Finprov Learning",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function BusinessProgramPage({
  params,
}: {
  params: Promise<{ program: string }>;
}) {
  const { program: programSlug } = await params;
  const program = getBusinessProgram(programSlug);

  if (!program) {
    notFound();
  }

  return <BusinessProgramDetailView program={program} />;
}
