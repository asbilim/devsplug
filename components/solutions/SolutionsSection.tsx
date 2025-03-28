"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "@/src/i18n/routing";
import { Skeleton } from "@/components/ui/skeleton";
import { SolutionCard } from "./SolutionCard";
import { EmptySolutions } from "./EmptySolutions";
import { ArrowRight, Code } from "lucide-react";
import { toast } from "sonner";
import { Solution, SolutionWithChallenge } from "@/app/types/solutions";

export function SolutionsSection() {
  const t = useTranslations();
  const solutionsT = useTranslations("solutions");
  const [isLoading, setIsLoading] = useState(true);
  const [solutions, setSolutions] = useState<SolutionWithChallenge[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSolutions = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/challenges/solutions/featured/?limit=3`,
          {
            credentials: "include",
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch solutions");
        }

        const data = await response.json();
        const solutionsWithChallenge = data.map((solution: any) => ({
          ...solution,
          challenge: {
            id: solution.challenge?.id || 0,
            title: solution.challenge?.title || "Unknown Challenge",
            slug: solution.challenge?.slug || "unknown",
            difficulty: solution.challenge?.difficulty || "medium",
          },
        }));

        setSolutions(solutionsWithChallenge);
      } catch (error) {
        console.error("Error fetching solutions:", error);
        setError(solutionsT("loadingError"));
        toast.error(solutionsT("loadingError"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchSolutions();
  }, [t, solutionsT]);

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("Home.publicSolutionsTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              {solutionsT("tryAgain")}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <div className="rounded-full bg-primary/10 p-2">
            <Code className="h-4 w-4 text-primary" />
          </div>
          <CardTitle className="text-xl font-bold">
            {solutionsT("mostRecent")}
          </CardTitle>
        </div>
        <Button asChild variant="ghost" className="gap-1">
          <Link href="/solutions">
            {solutionsT("viewAll")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <SolutionCardSkeleton />
            <SolutionCardSkeleton />
            <SolutionCardSkeleton />
          </div>
        ) : solutions.length === 0 ? (
          <EmptySolutions />
        ) : (
          <div className="space-y-4">
            {solutions.map((solution) => (
              <SolutionCard key={solution.id} solution={solution} />
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t bg-muted/20 flex justify-center pt-4">
        <Button asChild>
          <Link href="/solutions">{solutionsT("browse")}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

function SolutionCardSkeleton() {
  return (
    <div className="p-4 border rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-4 w-16" />
      </div>
      <Skeleton className="h-20 w-full mb-3" />
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-9 w-24" />
      </div>
    </div>
  );
}
