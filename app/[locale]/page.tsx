import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Trophy, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/src/i18n/routing";
import { ChallengeSkeleton } from "@/components/challenge-skeleton";
import { ChallengeFilters } from "@/components/challenge-filters";
import { SupportProject } from "./components/support-project";
import { Separator } from "@/components/ui/separator";
import { getChallenges } from "@/app/actions/challenges";
import { Pagination } from "@/components/pagination";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Home" });

  return {
    title: t("title"),
    description: t("description"),
    keywords: [
      "developer community",
      "coding",
      "programming",
      "software development",
      "tech community",
    ],
    authors: [{ name: "Devsplug Team" }],
    openGraph: {
      type: "website",
      title: "Devsplug - Developer Community Hub",
      description: t("description"),
      siteName: "Devsplug",
    },
    twitter: {
      card: "summary_large_image",
      title: "Devsplug - Developer Community Hub",
      description: t("description"),
    },
  };
}

async function ChallengesList({
  searchParams,
  locale,
}: {
  searchParams: {
    page?: string;
    difficulty?: string;
    category?: string;
    search?: string;
    tags?: string;
  };
  locale: string;
}) {
  const t = await getTranslations("Home");

  const params = {
    page: Number((await searchParams)?.page) || 1,
    ...((await searchParams)?.difficulty && {
      difficulty: String((await searchParams).difficulty),
    }),
    ...((await searchParams)?.category && {
      category: String((await searchParams).category),
    }),
    ...((await searchParams)?.search && {
      search: String((await searchParams).search),
    }),
    ...((await searchParams)?.tags && {
      tags: String((await searchParams).tags).split(","),
    }),
  };

  const challenges = await getChallenges(params);

  console.log("Challenges:", challenges);
  console.log("Challenges.data:", challenges?.data);
  console.log("Challenges.currentPage:", challenges?.currentPage);
  console.log("Challenges.totalPages:", challenges?.totalPages);

  if (!challenges?.data?.length) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">{t("noResults")}</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {challenges.data.map((challenge) => (
          <Card
            key={challenge.id}
            className="group h-full transition-colors hover:bg-muted/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge
                  variant={
                    challenge.difficulty === "easy"
                      ? "default"
                      : challenge.difficulty === "medium"
                      ? "secondary"
                      : "destructive"
                  }>
                  {challenge.difficulty}
                </Badge>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Trophy className="h-4 w-4" />
                  <span>{challenge.points}</span>
                </div>
              </div>
              <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                {challenge.title}
              </CardTitle>
              <CardDescription className="line-clamp-2">
                {challenge.description}
              </CardDescription>
              <div className="flex flex-wrap gap-2 mt-2">
                {challenge.tags?.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{challenge.estimated_time} min</span>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/challenges/${challenge.slug}`}>
                    {t("start")} <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {challenges.data.length < 9 &&
          Array.from({ length: 9 - challenges.data.length }).map((_, index) => (
            <div key={`empty-${index}`} className="hidden lg:block" />
          ))}
      </div>
      <Pagination
        className="mt-8"
        currentPage={challenges.currentPage}
        totalPages={challenges.totalPages}
        locale={locale}
      />
    </>
  );
}

export default async function HomePage({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams: {
    page?: string;
    difficulty?: string;
    category?: string;
    search?: string;
    tags?: string;
  };
}) {
  const { locale } = params;
  const t = await getTranslations("Home");

  return (
    <div className="container min-h-screen space-y-8 py-10">
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
    </div>
  );
}
