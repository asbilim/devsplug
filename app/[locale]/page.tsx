import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { ChallengeSkeleton } from "@/components/challenge-skeleton";
import { ChallengeFilters } from "@/components/challenge-filters";
import { ChallengesList } from "./components/challenges-list";
import { LanguageDistribution } from "./components/language-distribution";
import { RecentActivity } from "./components/recent-activity";
import { SupportProject } from "./components/support-project";
import { generateHomeMetadata } from "./utils/metadata";
import { Separator } from "@/components/ui/separator";

export const generateMetadata = generateHomeMetadata;

export default async function HomePage({
  searchParams,
  params,
}: {
  searchParams: { [key: string]: string | undefined };
  params: { locale: string };
}) {
  const { locale } = await params;
  const t = await getTranslations("Home");

  return (
    <div className="container min-h-screen space-y-12 py-10">
      <div className="text-center">
        <h1 className="font-mono text-4xl font-bold tracking-tight sm:text-6xl gradient-text">
          {t("title")}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          {t("description")}
        </p>
      </div>

      {/* Support Project Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold tracking-tight">
            {t("support.title")}
          </h2>
        </div>
        <SupportProject />
      </div>

      <Separator />

      <ChallengeFilters />

      {/* Main Challenges Grid */}
      <Suspense
        key={JSON.stringify(await searchParams)}
        fallback={
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <ChallengeSkeleton key={i} />
            ))}
          </div>
        }>
        <ChallengesList searchParams={searchParams} locale={locale} />
      </Suspense>

      <Separator />

      {/* Stats and Activity Section */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        <Suspense
          fallback={
            <div className="h-[400px] animate-pulse bg-muted rounded-lg" />
          }>
          <LanguageDistribution />
        </Suspense>

        <Suspense
          fallback={
            <div className="h-[400px] animate-pulse bg-muted rounded-lg" />
          }>
          <RecentActivity />
        </Suspense>
      </div>
    </div>
  );
}
