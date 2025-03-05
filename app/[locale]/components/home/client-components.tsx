"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Clock,
  BookOpen,
  Trophy,
  ThumbsUp,
  MessageSquare,
  ExternalLink,
} from "lucide-react";
import { Link } from "@/src/i18n/routing";
import { Challenge } from "@/app/types/challenge";

export function ChallengeCard({ challenge }: { challenge: Challenge }) {
  const t = useTranslations("Home");

  return (
    <Card className="group h-full transition-all hover:shadow-md hover:border-primary/50">
      <CardHeader className="pb-2">
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
        <CardTitle className="text-lg mt-2">{challenge.title}</CardTitle>
        <CardDescription className="line-clamp-2">
          {challenge.description || t("noDescription")}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>
              {challenge.estimated_time} {t("timeUnit.minutes")}
            </span>
          </div>
          {challenge.category && (
            <div className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              <span>
                {typeof challenge.category === "object"
                  ? challenge.category.name
                  : challenge.category}
              </span>
            </div>
          )}
        </div>
        {challenge.tags && challenge.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {challenge.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {challenge.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{challenge.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="default" size="sm" asChild className="w-full">
          <Link href={`/challenges/${challenge.slug}`}>
            {t("start")} <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export function SolutionCard({
  item,
  locale,
}: {
  item: {
    challenge: Challenge;
    solutions: any[];
  };
  locale: string;
}) {
  const t = useTranslations("Home");

  return (
    <Card className="overflow-hidden border-muted-foreground/20">
      <CardHeader className="bg-muted/30">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">
              <Link
                href={`/challenges/${item.challenge.slug}`}
                className="hover:text-primary transition-colors">
                {item.challenge.title}
              </Link>
            </CardTitle>
            <CardDescription className="mt-1">
              {t("solutionsCount", { count: item.solutions.length })}
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/challenges/${item.challenge.slug}`}>
              {t("viewChallenge")} <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {item.solutions.slice(0, 2).map((solution) => (
            <div
              key={solution.id}
              className="p-4 hover:bg-muted/20 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-mono">
                    {solution.language}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {new Date(solution.created_at).toLocaleDateString(locale)}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <button
                    className="flex items-center gap-1 hover:text-primary transition-colors"
                    onClick={() => alert(t("featureComingSoon"))}>
                    <ThumbsUp className="h-4 w-4" />
                    <span>{solution.likes_count}</span>
                  </button>
                  <button
                    className="flex items-center gap-1 hover:text-primary transition-colors"
                    onClick={() => alert(t("featureComingSoon"))}>
                    <MessageSquare className="h-4 w-4" />
                    <span>{solution.comments_count}</span>
                  </button>
                </div>
              </div>
              <div className="relative">
                <pre className="overflow-x-auto p-4 rounded-md bg-muted text-sm max-h-32">
                  <code>
                    {solution.code.slice(0, 300)}
                    {solution.code.length > 300 ? "..." : ""}
                  </code>
                </pre>
                <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-background to-transparent pointer-events-none" />
              </div>
              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {solution.user.username}
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {solution.user.title || t("defaultTitle")}
                  </Badge>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link
                    href={`/challenges/${item.challenge.slug}/solutions/${solution.id}`}>
                    {t("viewSolution")}{" "}
                    <ExternalLink className="ml-2 h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
          {item.solutions.length > 2 && (
            <div className="p-4 text-center">
              <Button variant="ghost" asChild>
                <Link href={`/challenges/${item.challenge.slug}/solutions`}>
                  {t("viewMoreSolutions", {
                    count: item.solutions.length - 2,
                  })}
                </Link>
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
