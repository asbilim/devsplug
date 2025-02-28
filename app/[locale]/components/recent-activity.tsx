import { getTranslations } from "next-intl/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/src/i18n/routing";
import { formatDistanceToNow } from "date-fns";

interface Solution {
  id: number;
  user: {
    id: number;
    username: string;
    profile: string | null;
  };
  language: string;
  created_at: string;
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

export async function RecentActivity() {
  const t = await getTranslations("Home");

  // Fetch solutions from the API
  const solutionGroups = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/challenges/solutions/public/`,
    { cache: "no-store" }
  )
    .then((res) => res.json())
    .catch(() => []);

  if (!solutionGroups.length) {
    return null;
  }

  // Flatten and sort all solutions by date
  const allSolutions = solutionGroups
    .flatMap((group: SolutionGroup) =>
      group.solutions.map((solution) => ({
        ...solution,
        challenge: group.challenge,
      }))
    )
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    .slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("recentActivity.title")}</CardTitle>
        <CardDescription>{t("recentActivity.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {allSolutions.map((solution) => (
            <div
              key={solution.id}
              className="flex items-start gap-4 pb-4 border-b last:border-0">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={solution.user.profile || ""}
                  alt={solution.user.username}
                />
                <AvatarFallback>
                  {solution.user.username.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1 flex-1">
                <p className="text-sm">
                  <span className="font-medium">{solution.user.username}</span>{" "}
                  {t("recentActivity.submitted")}{" "}
                  <Link
                    href={`/challenges/${solution.challenge.slug}`}
                    className="font-medium hover:underline">
                    {solution.challenge.title}
                  </Link>
                </p>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {solution.language}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(solution.created_at), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
