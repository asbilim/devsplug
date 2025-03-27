import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ChallengeDetails } from "./challenge-details";
import { ChallengeDetailsSkeleton } from "./challenge-details-skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@/src/i18n/routing";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  ThumbsUp,
  MessageSquare,
  ArrowRight,
  Code,
  CalendarIcon,
} from "lucide-react";
import { getChallengeSolutions } from "@/app/services/solutions";
import { getLanguageColor } from "@/lib/solutions";

async function getChallenge(slug: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/challenges/listings/${slug}/`,
      { next: { revalidate: 60 } }
    );

    if (!response.ok) {
      if (response.status === 404) {
        notFound();
      }
      throw new Error("Failed to fetch challenge");
    }

    const data = await response.json();

    // Validate required fields
    if (!data.content || !data.title) {
      throw new Error("Invalid challenge data");
    }

    return data;
  } catch (error) {
    console.error("Error fetching challenge:", error);
    notFound();
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string; locale: string };
}): Promise<Metadata> {
  const { locale, slug } = params;
  const t = await getTranslations({ locale, namespace: "Challenge" });

  try {
    const challenge = await getChallenge(slug);

    return {
      title: `${challenge.title} | Devsplug`,
      description: challenge.description,
      keywords: [
        "coding challenge",
        "programming",
        ...challenge.tags,
        challenge.category.name,
      ],
    };
  } catch (error) {
    return {
      title: t("notFound.title"),
      description: t("notFound.description"),
    };
  }
}

export default async function ChallengePage({
  params,
}: {
  params: { slug: string; locale: string };
}) {
  const t = await getTranslations();
  const tChallenge = await getTranslations("Challenge");
  const solutionsT = await getTranslations("solutions");
  const challenge = await getChallenge(params.slug);

  // Fetch real solutions from the backend
  const solutionsResponse = await getChallengeSolutions(params.slug);
  console.log(
    "Solutions response:",
    JSON.stringify(solutionsResponse, null, 2)
  );

  // Limit to 3 solutions on the frontend
  const solutions = solutionsResponse.solutions.slice(0, 3);
  console.log(`Found ${solutions.length} solutions to display.`);

  return (
    <div className="container py-8 min-h-screen space-y-8">
      <Suspense fallback={<ChallengeDetailsSkeleton />}>
        <ChallengeDetails challenge={challenge} />
      </Suspense>
      {/* Solutions Section */}
      <div className="container my-12 py-6 px-4 sm:px-6 lg:px-8 ">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">{solutionsT("title")}</h2>
          </div>
          <Link
            href={`/challenges/${params.slug}/solutions`}
            className="flex items-center text-primary hover:text-primary/80 transition-all gap-1 font-medium">
            {solutionsT("viewAll")}
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {solutions.length === 0 ? (
            <Card className="col-span-full">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Code className="h-16 w-16 text-muted-foreground mb-4" />
                <h2 className="text-xl font-semibold mb-2">
                  {tChallenge("solutions.empty")}
                </h2>
                <p className="text-muted-foreground max-w-md mb-6">
                  {tChallenge("solutions.noSolutionsYet")}
                </p>
                <Link
                  href={`/challenges/${params.slug}/solution`}
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                  {tChallenge("solutions.beFirstToSubmit")}
                </Link>
              </CardContent>
            </Card>
          ) : (
            solutions.map((solution) => (
              <Link
                key={solution.id}
                href={`/challenges/${params.slug}/solutions/${solution.id}`}
                className="block group">
                <Card className="h-full overflow-hidden border-muted/20 bg-background hover:shadow-md hover:border-primary/20 transition-all duration-300">
                  <CardHeader className="bg-muted/10 pb-2 group-hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <Avatar className="border-2 border-background group-hover:border-primary/20 transition-colors">
                        <AvatarImage
                          src={solution.user?.profile || ""}
                          alt={solution.user?.username || "Anonymous"}
                        />
                        <AvatarFallback className="bg-primary/10 text-primary font-medium">
                          {solution.user?.username
                            ? solution.user.username.slice(0, 2).toUpperCase()
                            : "AN"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium group-hover:text-primary transition-colors">
                          {solution.user?.username || "Anonymous"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {solution.user?.title || t("Home.defaultTitle")}
                        </p>
                      </div>
                      <div className="ml-auto flex items-center">
                        <Badge
                          variant="outline"
                          className={`font-mono ${getLanguageColor(
                            solution.language
                          )}`}>
                          {solution.language}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="flex flex-col space-y-3">
                      <div className="relative mb-3">
                        <pre className="overflow-x-auto p-4 rounded-md bg-muted text-sm max-h-24">
                          <code>
                            {solution.code?.slice(0, 200) ||
                              "[No code provided]"}
                            {solution.code && solution.code.length > 200
                              ? "..."
                              : ""}
                          </code>
                        </pre>
                        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-background to-transparent pointer-events-none" />
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <CalendarIcon className="h-3.5 w-3.5" />
                          <span className="text-xs">
                            {new Date(solution.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <ThumbsUp className="h-3.5 w-3.5" />
                            <span className="text-xs font-medium">
                              {solution.likes_count}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <MessageSquare className="h-3.5 w-3.5" />
                            <span className="text-xs font-medium">
                              {solution.comments_count || 0}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
