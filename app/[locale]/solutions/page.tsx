import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@/src/i18n/routing";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, Code, Search } from "lucide-react";
import { AllSolutions } from "./components/all-solutions";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({
    locale: params.locale,
    namespace: "solutions",
  });

  return {
    title: `${t("title")} | Devsplug`,
    description: "Browse all community solutions across different challenges",
  };
}

export default async function SolutionsPage({
  params,
}: {
  params: { locale: string };
}) {
  const t = await getTranslations("solutions");
  const homeT = await getTranslations("Home");

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <Button variant="ghost" size="sm" asChild className="mb-2">
            <Link href="/" className="flex items-center gap-2">
              <ChevronLeft className="h-4 w-4" />
              {homeT("back")}
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
          <p className="text-muted-foreground mt-2">
            Browse all community solutions across different challenges
          </p>
        </div>
      </div>

      <Suspense
        fallback={
          <div className="space-y-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <CardHeader className="bg-muted/30 pb-4">
                  <Skeleton className="h-8 w-60" />
                  <Skeleton className="h-4 w-40 mt-1" />
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-4">
                    {Array.from({ length: 2 }).map((_, j) => (
                      <div
                        key={j}
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
                </CardContent>
              </Card>
            ))}
          </div>
        }>
        <AllSolutions locale={params.locale} />
      </Suspense>
    </div>
  );
}
