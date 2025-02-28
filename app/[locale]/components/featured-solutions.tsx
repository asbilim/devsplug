"use client";

import { useState } from "react";
import { getTranslations } from "next-intl/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "@/src/i18n/routing";
import {
  ChevronLeft,
  ChevronRight,
  Code,
  ThumbsUp,
  MessageSquare,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Solution {
  id: number;
  user: {
    id: number;
    username: string;
    title: string;
    profile: string | null;
  };
  code: string;
  language: string;
  created_at: string;
  likes_count: number;
  comments_count: number;
}

interface Challenge {
  id: number;
  title: string;
  slug: string;
  difficulty: string;
}

interface SolutionGroup {
  challenge: Challenge;
  solutions: Solution[];
}

export async function FeaturedSolutions() {
  const t = await getTranslations("Home");

  // Fetch solutions from the API
  const solutionGroups: SolutionGroup[] = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/challenges/solutions/public/`,
    { cache: "no-store" }
  )
    .then((res) => res.json())
    .catch(() => []);

  if (!solutionGroups.length) {
    return null;
  }

  // Get the top 5 solution groups with the most solutions
  const topSolutionGroups = solutionGroups
    .sort((a, b) => b.solutions.length - a.solutions.length)
    .slice(0, 5);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">
          {t("featured.solutions.title")}
        </h2>
        <Link
          href="/solutions"
          className="text-sm text-muted-foreground hover:text-primary transition-colors">
          {t("viewAll")} →
        </Link>
      </div>

      <Tabs
        defaultValue={topSolutionGroups[0].challenge.slug}
        className="w-full">
        <div className="flex items-center justify-between mb-4">
          <TabsList className="grid grid-flow-col auto-cols-max gap-2 overflow-x-auto p-1">
            {topSolutionGroups.map((group) => (
              <TabsTrigger
                key={group.challenge.slug}
                value={group.challenge.slug}
                className="flex items-center gap-2">
                <span className="truncate max-w-[120px]">
                  {group.challenge.title}
                </span>
                <Badge variant="outline" className="ml-1">
                  {group.solutions.length}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {topSolutionGroups.map((group) => (
          <TabsContent
            key={group.challenge.slug}
            value={group.challenge.slug}
            className="mt-0">
            <div className="relative">
              <ScrollArea className="pb-4">
                <div className="flex space-x-4 pb-4">
                  {group.solutions.map((solution) => (
                    <SolutionCard
                      key={solution.id}
                      solution={solution}
                      challenge={group.challenge}
                    />
                  ))}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

function SolutionCard({
  solution,
  challenge,
}: {
  solution: Solution;
  challenge: Challenge;
}) {
  return (
    <Card className="w-[350px] flex-shrink-0">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={solution.user.profile || ""}
                alt={solution.user.username}
              />
              <AvatarFallback>
                {solution.user.username.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{solution.user.username}</p>
              <p className="text-xs text-muted-foreground">
                {solution.user.title}
              </p>
            </div>
          </div>
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
        </div>
      </CardHeader>
      <CardContent>
        <div className="bg-muted rounded-md p-3 mb-3 h-[150px] overflow-hidden relative">
          <pre className="text-xs overflow-hidden">
            <code>
              {solution.code.substring(0, 400)}
              {solution.code.length > 400 ? "..." : ""}
            </code>
          </pre>
          <div className="absolute bottom-0 right-0 bg-gradient-to-t from-muted to-transparent h-10 w-full"></div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-muted-foreground text-sm">
              <ThumbsUp className="h-4 w-4" />
              <span>{solution.likes_count}</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground text-sm">
              <MessageSquare className="h-4 w-4" />
              <span>{solution.comments_count}</span>
            </div>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link
              href={`/challenges/${challenge.slug}/solutions/${solution.id}`}>
              <Code className="h-4 w-4 mr-2" /> View
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
