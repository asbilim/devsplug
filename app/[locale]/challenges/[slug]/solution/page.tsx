import { getServerSession } from "next-auth/next";
import { SolutionEditor } from "./solution-editor";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

interface ChallengeParams {
  params: {
    slug: string;
    locale: string;
  };
}

async function getChallenge(slug: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/challenges/listings/${slug}/`,
      { next: { revalidate: 60 } }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch challenge: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching challenge:", error);
    return null;
  }
}

export default async function ChallengeSolutionPage({
  params,
}: ChallengeParams) {
  const { slug, locale } = params;
  const t = await getTranslations("Challenge");

  // Get the challenge data
  const challenge = await getChallenge(slug);

  if (!challenge) {
    return notFound();
  }

  return (
    <div className="container max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold mb-4">
        {t("solution")}: {challenge.title}
      </h1>
      <SolutionEditor params={params} challenge={challenge} slug={slug} />
    </div>
  );
}
