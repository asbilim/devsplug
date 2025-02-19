import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Challenge } from "@/app/actions/challenges";
import { SolutionEditor } from "./solution-editor";
import ClientLayout from "@/app/[locale]/client-layout";

async function getChallenge(slug: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/challenges/listings/${slug}/`,
      { next: { revalidate: 60 } }
    );

    if (!response.ok) {
      if (response.status === 404) {
        notFound();
      }
      throw new Error("Failed to fetch challenge");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching challenge:", error);
    notFound();
  }
}

export default async function SolutionPage({
  params,
}: {
  params: { slug: string; locale: string };
}) {
  const challenge = await getChallenge(params.slug);

  return (
    <ClientLayout locale={params.locale}>
      <Suspense fallback={<div>Loading...</div>}>
        <SolutionEditor params={params} challenge={challenge} />
      </Suspense>
    </ClientLayout>
  );
}
