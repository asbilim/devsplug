"use client";

import { useTranslations } from "next-intl";
import { formatDistance } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@/src/i18n/routing";
import { ExternalLink, MessageSquare, ThumbsUp } from "lucide-react";
import { Solution } from "@/app/types/solutions";

interface SolutionCardProps {
  solution: Solution & {
    challenge: {
      id: number;
      title: string;
      slug: string;
      difficulty: string;
    };
  };
}

export function SolutionCard({ solution }: SolutionCardProps) {
  const t = useTranslations();

  return (
    <div className="p-4 border rounded-lg hover:bg-muted/20 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="font-mono">
            {solution.language}
          </Badge>
          <Link
            href={`/challenges/${solution.challenge.slug}`}
            className="text-sm text-muted-foreground hover:text-primary transition-colors">
            {solution.challenge.title}
          </Link>
          <Badge
            variant={
              solution.challenge.difficulty === "easy"
                ? "default"
                : solution.challenge.difficulty === "medium"
                ? "secondary"
                : "destructive"
            }
            className="h-5">
            {solution.challenge.difficulty}
          </Badge>
        </div>
        <span className="text-xs text-muted-foreground">
          {formatDistance(new Date(solution.created_at), new Date(), {
            addSuffix: true,
          })}
        </span>
      </div>

      <div className="relative mb-3">
        <pre className="overflow-x-auto p-4 rounded-md bg-muted text-sm max-h-24">
          <code>
            {solution.code?.slice(0, 200) || "[No code provided]"}
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
                ? solution.user.username.substring(0, 2).toUpperCase()
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
            href={`/challenges/${solution.challenge.slug}/solutions/${solution.id}`}>
            {t("Home.viewSolution")} <ExternalLink className="ml-2 h-3 w-3" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
