import { Suspense } from "react";
import { useTranslations } from "next-intl";
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
import { getChallenges } from "@/app/actions/challenges";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "Home" });

  return {
    title: "Devsplug - Developer Community Hub",
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

async function ChallengesList() {
  const t = await getTranslations("Home");
  const challenges = await getChallenges();

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {challenges.map((challenge) => (
        <Card
          key={challenge.id}
          className="h-full transition-colors hover:bg-muted/50">
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
                <span>{challenge.points} pts</span>
              </div>
            </div>
            <CardTitle className="line-clamp-2">{challenge.title}</CardTitle>
            <CardDescription className="line-clamp-2">
              {challenge.description}
            </CardDescription>
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
    </div>
  );
}

export default function HomePage() {
  const t = useTranslations("Home");

  return (
    <div className="container min-h-screen py-10">
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            {t("welcome")}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            {t("description")}
          </p>
        </div>

        <Suspense
          fallback={
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <ChallengeSkeleton key={i} />
              ))}
            </div>
          }>
          <ChallengesList />
        </Suspense>
      </div>
    </div>
  );
}
