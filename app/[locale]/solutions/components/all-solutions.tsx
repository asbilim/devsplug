"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "@/src/i18n/routing";
import { formatDistance } from "date-fns";
import { ExternalLink, ThumbsUp, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { SolutionGroup } from "@/app/types/solutions";
import { getLanguageColor } from "@/lib/solutions";

export function AllSolutions({ locale }: { locale: string }) {
  const t = useTranslations();
  const solutionsT = useTranslations("solutions");
  const [isLoading, setIsLoading] = useState(true);
  const [solutionGroups, setSolutionGroups] = useState<SolutionGroup[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSolutions = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/challenges/solutions/public/`,
          {
            credentials: "include",
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch solutions");
        }

        const data = await response.json();
        // Sort challenges by number of solutions (descending)
        const sortedGroups = [...data].sort(
          (a, b) => (b.solutions?.length || 0) - (a.solutions?.length || 0)
        );
        setSolutionGroups(sortedGroups);
      } catch (error) {
        console.error("Error fetching solutions:", error);
        setError("Failed to load solutions. Please try again later.");
        toast.error(t("Home.solutionsError"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchSolutions();
  }, [t]);

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          {solutionsT("tryAgain")}
        </Button>
      </div>
    );
  }

  if (!isLoading && solutionGroups.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">
          {solutionsT("noSolutions")}
        </p>
        <Button asChild>
          <Link href="/challenges">{t("Home.exploreAllChallenges")}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {isLoading
        ? // Loading skeleton
          Array.from({ length: 3 }).map((_, index) => (
            <Card key={index} className="overflow-hidden animate-pulse">
              <CardHeader className="bg-muted/30">
                <div className="h-6 w-48 bg-muted rounded" />
                <div className="h-4 w-32 bg-muted rounded mt-2" />
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="p-4 border rounded-lg">
                      <div className="h-20 bg-muted rounded mb-4" />
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 bg-muted rounded-full" />
                          <div className="h-4 w-24 bg-muted rounded" />
                        </div>
                        <div className="h-8 w-24 bg-muted rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))
        : solutionGroups.map((group) => (
            <Card key={group.challenge.id} className="overflow-hidden">
              <CardHeader className="bg-muted/30">
                <CardTitle>
                  <Link
                    href={`/challenges/${group.challenge.slug}`}
                    className="hover:text-primary transition-colors">
                    {group.challenge.title}
                  </Link>
                </CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <Badge
                    variant={
                      group.challenge.difficulty === "easy"
                        ? "default"
                        : group.challenge.difficulty === "medium"
                        ? "secondary"
                        : "destructive"
                    }>
                    {group.challenge.difficulty}
                  </Badge>
                  <span>•</span>
                  <span>{group.solutions.length} solutions</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {group.solutions.slice(0, 3).map((solution) => (
                    <div
                      key={solution.id}
                      className="p-4 border rounded-lg hover:bg-muted/20 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <Badge
                          variant="outline"
                          className={`font-mono ${getLanguageColor(
                            solution.language
                          )}`}>
                          {solution.language}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatDistance(
                            new Date(solution.created_at),
                            new Date(),
                            {
                              addSuffix: true,
                            }
                          )}
                        </span>
                      </div>
                      <div className="relative mb-3">
                        <pre className="overflow-x-auto p-4 rounded-md bg-muted text-sm max-h-24">
                          <code>
                            {solution.code?.slice(0, 200) ||
                              "[No code provided]"}
                            {solution.code?.length > 200 ? "..." : ""}
                          </code>
                        </pre>
                        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-background to-transparent pointer-events-none" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={solution.user?.profile || ""}
                              alt={solution.user?.username || "Anonymous"}
                            />
                            <AvatarFallback>
                              {solution.user?.username
                                ? solution.user.username
                                    .substring(0, 2)
                                    .toUpperCase()
                                : "AN"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">
                              {solution.user?.username || "Anonymous"}
                            </span>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <ThumbsUp className="h-3 w-3" />
                                <span>{solution.likes_count}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MessageSquare className="h-3 w-3" />
                                <span>{solution.comments_count || 0}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" asChild>
                          <Link
                            href={`/challenges/${group.challenge.slug}/solutions/${solution.id}`}>
                            {t("Home.viewSolution")}{" "}
                            <ExternalLink className="ml-2 h-3 w-3" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                  {group.solutions.length > 3 && (
                    <Button variant="outline" className="w-full" asChild>
                      <Link
                        href={`/challenges/${group.challenge.slug}/solutions`}>
                        {t("solutions.viewMore", {
                          count: group.solutions.length - 3,
                        })}
                      </Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
    </div>
  );
}
