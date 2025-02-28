import { getTranslations } from "next-intl/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Solution {
  language: string;
}

interface SolutionGroup {
  solutions: Solution[];
}

export async function LanguageDistribution() {
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

  // Count solutions by language
  const languageCounts: Record<string, number> = {};
  solutionGroups.forEach((group: SolutionGroup) => {
    group.solutions.forEach((solution) => {
      languageCounts[solution.language] =
        (languageCounts[solution.language] || 0) + 1;
    });
  });

  // Sort languages by count
  const sortedLanguages = Object.entries(languageCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  // Calculate total for percentages
  const total = sortedLanguages.reduce((sum, [_, count]) => sum + count, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("featured.languages.title")}</CardTitle>
        <CardDescription>{t("featured.languages.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedLanguages.map(([language, count]) => {
            const percentage = Math.round((count / total) * 100);
            return (
              <div key={language} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-mono">
                      {language}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {count} solutions
                    </span>
                  </div>
                  <span className="text-sm font-medium">{percentage}%</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
