import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ChallengeDetails } from "./challenge-details";
import { ChallengeDetailsSkeleton } from "./challenge-details-skeleton";

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

    const data = await response.json();

    // Validate required fields
    if (!data.content || !data.title) {
      throw new Error("Invalid challenge data");
    }

    return data;
  } catch (error) {
    console.error("Error fetching challenge:", error);
    notFound();
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string; locale: string };
}): Promise<Metadata> {
  const { locale, slug } = params;
  const t = await getTranslations({ locale, namespace: "Challenge" });

  try {
    const challenge = await getChallenge(slug);

    return {
      title: `${challenge.title} | Devsplug`,
      description: challenge.description,
      keywords: [
        "coding challenge",
        "programming",
        ...challenge.tags,
        challenge.category.name,
      ],
    };
  } catch (error) {
    return {
      title: t("notFound.title"),
      description: t("notFound.description"),
    };
  }
}

export default async function ChallengePage({
  params,
}: {
  params: { slug: string; locale: string };
}) {
  const challenge = await getChallenge(params.slug);

  return (
    <div className="container py-8 min-h-screen space-y-8">
      <Suspense fallback={<ChallengeDetailsSkeleton />}>
        <ChallengeDetails challenge={challenge} />
      </Suspense>
    </div>
  );
}
