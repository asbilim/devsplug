"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@/src/i18n/routing";
import { ArrowRight, Code, ThumbsUp } from "lucide-react";
import { toast } from "sonner";
import { formatDistance } from "date-fns";

interface SolutionUser {
  id: number;
  username: string;
  profile?: string | null;
  title?: string;
}

interface Solution {
  id: number;
  user: SolutionUser;
  language: string;
  likes_count: number;
  comments_count?: number;
  created_at: string;
  status: string;
  is_private: boolean;
  challenge_slug?: string;
  challenge_id?: number;
}

interface SolutionsResponse {
  solutions: Solution[];
  total: number;
}

export function SolutionsSection() {
  const t = useTranslations();
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSolutions = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/challenges/solutions/public/`,
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch solutions");
        }

        const data = await response.json();

        // Process the data into a flat array of solutions
        let allSolutions: Solution[] = [];
        if (Array.isArray(data)) {
          data.forEach((item: any) => {
            if (item.solutions && Array.isArray(item.solutions)) {
              // Take the top solutions from each challenge and add challenge info
              const enhancedSolutions = item.solutions
                .slice(0, 3)
                .map((solution: any) => ({
                  ...solution,
                  challenge_slug: item.challenge.slug,
                  challenge_id: item.challenge.id,
                }));
              allSolutions = [...allSolutions, ...enhancedSolutions];
            }
          });
        }

        // Get only the latest 3 solutions overall, sorted by date
        allSolutions.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setSolutions(allSolutions.slice(0, 3));
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
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            {t("Home.publicSolutionsTitle")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-8 text-center">
            <p className="text-muted-foreground">{error}</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader className="flex-row justify-between items-center">
        <CardTitle className="flex items-center gap-2">
          <Code className="h-5 w-5" />
          {t("Home.publicSolutionsTitle")}
        </CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/solutions" className="flex items-center gap-1">
            <span>{t("solutions.viewAll")}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          // Loading skeleton
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : solutions.length === 0 ? (
          // Empty state
          <div className="py-12 text-center">
            <p className="text-muted-foreground mb-4">
              {t("Home.noPublicSolutions")}
            </p>
            <Button asChild>
              <Link href="/challenges">{t("Home.exploreAllChallenges")}</Link>
            </Button>
          </div>
        ) : (
          // Solutions list
          <div className="space-y-4">
            {solutions.map((solution) => (
              <div
                key={solution.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/20 transition-colors">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border">
                    <AvatarImage
                      src={solution.user?.profile || ""}
                      alt={solution.user?.username || "Anonymous"}
                    />
                    <AvatarFallback>
                      {solution.user?.username
                        ? solution.user.username.substring(0, 2).toUpperCase()
                        : "AN"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">
                      {solution.user?.username || "Anonymous"}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm text-muted-foreground">
                        {solution.user?.title || t("Home.defaultTitle")}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        •{" "}
                        {formatDistance(
                          new Date(solution.created_at),
                          new Date(),
                          { addSuffix: true }
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  <Badge variant="outline" className="font-mono">
                    {solution.language}
                  </Badge>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <ThumbsUp className="h-3.5 w-3.5" />
                    <span>{solution.likes_count}</span>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link
                      href={`/challenges/${
                        solution.challenge_slug || ""
                      }/solutions/${solution.id}`}>
                      {t("Home.viewSolution")}
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
