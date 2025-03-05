import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Link } from "@/src/i18n/routing";
import { ArrowRight } from "lucide-react";
import { SolutionCard } from "./client-components";
import { Challenge } from "@/app/types/challenge";

export async function PublicSolutionsList({ locale }: { locale: string }) {
  const t = await getTranslations("Home");

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/challenges/solutions/public/`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch public solutions");
    }

    const solutions = await response.json();

    if (!solutions?.length) {
      return (
        <div className="text-center py-12">
          <p className="text-muted-foreground">{t("noPublicSolutions")}</p>
        </div>
      );
    }

    // Only show the first 2 challenges with solutions
    const limitedSolutions = solutions.slice(0, 2);

    return (
      <div className="space-y-8">
        {limitedSolutions.map(
          (item: { challenge: Challenge; solutions: any[] }) => (
            <SolutionCard key={item.challenge.id} item={item} locale={locale} />
          )
        )}

        <div className="flex justify-center mt-6">
          <Button variant="outline" size="lg" asChild>
            <Link href="/solutions" className="flex items-center gap-2">
              {t("viewAllSolutions")} <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching public solutions:", error);
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">{t("solutionsError")}</p>
      </div>
    );
  }
}
