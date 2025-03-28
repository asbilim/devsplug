"use client";

import { useTranslations } from "next-intl";
import { CodeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/src/i18n/routing";

export function EmptySolutions() {
  const t = useTranslations();
  const solutionsT = useTranslations("solutions");

  return (
    <div className="text-center py-10 space-y-4">
      <div className="flex justify-center">
        <div className="bg-muted rounded-full p-3">
          <CodeIcon className="h-10 w-10 text-muted-foreground" />
        </div>
      </div>
      <h3 className="text-lg font-medium">{t("Home.noPublicSolutions")}</h3>
      <p className="text-muted-foreground text-sm max-w-md mx-auto">
        {solutionsT("noSolutions")}
      </p>
      <Button asChild>
        <Link href="/challenges">{t("Home.exploreAllChallenges")}</Link>
      </Button>
    </div>
  );
}
