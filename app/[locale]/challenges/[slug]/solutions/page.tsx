import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/src/i18n/routing";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  ThumbsUp,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Filter,
  Languages,
  Bookmark,
  Code,
} from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SolutionFilters } from "./components/SolutionFilters";
import { Metadata } from "next";

interface SolutionsPageParams {
  params: {
    slug: string;
    locale: string;
  };
  searchParams: {
    page?: string;
    language?: string;
    sort?: string;
  };
}

interface Solution {
  id: number;
  user: {
    id: number;
    username: string;
    profile?: string | null;
    title?: string;
  };
  language: string;
  likes_count: number;
  comments_count?: number;
  created_at: string;
  status: string;
  is_private: boolean;
}

interface Challenge {
  id: number;
  title: string;
  slug: string;
  difficulty: string;
  description: string;
}

// Function to fetch challenge data with authentication
async function getChallenge(slug: string): Promise<Challenge | null> {
  try {
    const session = await getServerSession(authOptions);
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Add auth token if user is logged in
    if (session?.backendTokens?.accessToken) {
      headers["Authorization"] = `Bearer ${session.backendTokens.accessToken}`;
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/challenges/listings/${slug}/`,
      {
        next: { revalidate: 60 },
        headers,
      }
    );

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching challenge:", error);
    return null;
  }
}

// Function to fetch solutions with pagination and filters
async function getSolutions(
  slug: string,
  options: { page: number; language?: string; sort?: string }
): Promise<{
  solutions: Solution[];
  total: number;
  totalPages: number;
} | null> {
  try {
    const session = await getServerSession(authOptions);
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Add auth token if user is logged in
    if (session?.backendTokens?.accessToken) {
      headers["Authorization"] = `Bearer ${session.backendTokens.accessToken}`;
    }

    // Make direct request without pagination and filtering parameters
    // We'll filter the results in memory after getting the response
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/challenges/listings/${slug}/solutions/`;

    console.log("Fetching solutions with URL:", url);
    console.log("Request options:", {
      page: options.page,
      language: options.language,
      sort: options.sort,
    });

    const response = await fetch(url, {
      next: { revalidate: 60 },
      headers,
    });

    if (!response.ok) {
      console.error(`Error fetching solutions: ${response.status}`);
      return null;
    }

    let data = await response.json();
    console.log("Raw solutions data:", data);

    // If the backend returns results directly, use the results key
    let allSolutions = data.results || data;

    // Apply filtering in memory if language is specified
    if (options.language) {
      allSolutions = allSolutions.filter(
        (sol: Solution) =>
          sol.language.toLowerCase() === options.language?.toLowerCase()
      );
    }

    // Apply sorting in memory
    if (options.sort) {
      allSolutions = sortSolutions(allSolutions, options.sort);
    }

    // Apply pagination in memory
    const pageSize = 10;
    const startIndex = (options.page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedSolutions = allSolutions.slice(startIndex, endIndex);

    const totalSolutions = allSolutions.length;
    const totalPages = Math.ceil(totalSolutions / pageSize);

    console.log("Processed solutions:", {
      total: totalSolutions,
      totalPages,
      pageSize,
      currentPage: options.page,
      filteredCount: paginatedSolutions.length,
    });

    return {
      solutions: paginatedSolutions,
      total: totalSolutions,
      totalPages: totalPages,
    };
  } catch (error) {
    console.error("Error fetching solutions:", error);
    return null;
  }
}

// Sort solutions based on selected sort option
function sortSolutions(solutions: Solution[], sortOption: string): Solution[] {
  switch (sortOption) {
    case "newest":
      return [...solutions].sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    case "oldest":
      return [...solutions].sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
    case "mostLiked":
      return [...solutions].sort((a, b) => b.likes_count - a.likes_count);
    default:
      return solutions;
  }
}

export async function generateMetadata({
  params,
  searchParams,
}: SolutionsPageParams): Promise<Metadata> {
  const { slug, locale } = params;
  const language = searchParams.language;

  try {
    const t = await getTranslations({
      locale,
      namespace: "Challenge.solutions",
    });
    const tChallenge = await getTranslations({
      locale,
      namespace: "Challenge",
    });

    const challenge = await getChallenge(slug);
    if (!challenge) {
      return {
        title: t("notFound.title"),
        description: t("notFound.description"),
      };
    }

    // Build title and description based on language filter
    const title = language
      ? `${challenge.title} - ${t("title")} (${tChallenge(
          `language.${language.toLowerCase()}`
        )})`
      : `${challenge.title} - ${t("title")}`;

    const description = language
      ? t("metaDescriptionWithLanguage", {
          title: challenge.title,
          language: tChallenge(`language.${language.toLowerCase()}`),
        })
      : t("metaDescription", { title: challenge.title });

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: "website",
        siteName: "Devsplug",
        images: [
          {
            url: `/api/og?title=${encodeURIComponent(
              challenge.title
            )}&type=solutions`,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Solutions",
      description: "Browse community solutions for coding challenges",
    };
  }
}

export default async function ChallengeSolutionsPage({
  params,
  searchParams,
}: SolutionsPageParams) {
  const t = await getTranslations("Challenge.solutions");
  const tChallenge = await getTranslations("Challenge");
  const { slug, locale } = params;
  const page = parseInt(searchParams.page || "1");
  const language = searchParams.language;
  const sort = searchParams.sort || "newest";

  console.log("Request parameters:", { slug, page, language, sort });

  // Fetch real data
  const challenge = await getChallenge(slug);
  if (!challenge) {
    console.log("Challenge not found:", slug);
    return notFound();
  }

  console.log("Challenge data:", {
    id: challenge.id,
    title: challenge.title,
    slug: challenge.slug,
  });

  const solutionsData = await getSolutions(slug, {
    page,
    language,
    sort,
  });

  const solutions = solutionsData?.solutions || [];
  const totalPages = solutionsData?.totalPages || 1;
  const totalSolutions = solutionsData?.total || 0;

  console.log("Solutions summary:", {
    count: solutions.length,
    totalSolutions,
    totalPages,
    currentPage: page,
    hasSolutions: solutions.length > 0,
  });

  // Get available programming languages for filtering
  // In production, this would ideally come from an API endpoint
  const availableLanguages = [
    "python",
    "javascript",
    "typescript",
    "java",
    "cpp",
    "c",
    "csharp",
    "go",
    "ruby",
    "php",
    "swift",
    "kotlin",
  ];

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="mb-6 flex items-center">
        <Button variant="ghost" size="sm" asChild className="mr-2">
          <Link href={`/challenges/${slug}`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("back")}
          </Link>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">
            {challenge.title} - {t("title")}
          </h1>
          <p className="text-muted-foreground">{t("description")}</p>
        </div>

        <Button asChild className="mt-4 md:mt-0">
          <Link href={`/challenges/${slug}/solution`}>{t("submit")}</Link>
        </Button>
      </div>

      {/* Use the client component for filters */}
      <SolutionFilters
        currentLanguage={language || null}
        currentSort={sort}
        availableLanguages={availableLanguages}
        slug={slug}
      />

      {solutions.length === 0 ? (
        <Card className="w-full">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Code className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">{t("empty")}</h2>
            <p className="text-muted-foreground max-w-md mb-6">
              {language
                ? t("noSolutionsForLanguage", {
                    language: tChallenge(`language.${language.toLowerCase()}`),
                  })
                : t("noSolutionsYet")}
            </p>
            <Button asChild>
              <Link href={`/challenges/${slug}/solution`}>
                {t("beFirstToSubmit")}
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {solutions.map((solution) => (
              <Link
                key={solution.id}
                href={`/challenges/${slug}/solutions/${solution.id}`}
                className="block group">
                <Card className="h-full hover:border-primary/30 transition-colors">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-3">
                      <Avatar className="border border-border group-hover:border-primary/20 transition-colors">
                        <AvatarImage
                          src={solution.user.profile || ""}
                          alt={solution.user.username}
                        />
                        <AvatarFallback className="bg-primary/10 text-primary font-medium">
                          {solution.user.username.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium group-hover:text-primary transition-colors">
                          {solution.user.username}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {solution.user.title || t("defaultTitle")}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <Badge
                        variant="outline"
                        className="group-hover:bg-primary/5 transition-colors">
                        {solution.language}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="h-4 w-4 text-muted-foreground group-hover:text-primary/70 transition-colors" />
                        <span className="text-sm text-muted-foreground group-hover:text-primary/70 transition-colors">
                          {solution.likes_count}
                        </span>
                      </div>
                    </div>
                    <div className="mt-3 text-sm text-muted-foreground">
                      {formatRelativeTime(solution.created_at)}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  asChild>
                  <Link
                    href={`/challenges/${slug}/solutions?page=${page - 1}${
                      language ? `&language=${language}` : ""
                    }${sort ? `&sort=${sort}` : ""}`}>
                    <ChevronLeft className="h-4 w-4" />
                    {t("previous")}
                  </Link>
                </Button>

                <span className="text-sm text-muted-foreground px-2">
                  {t("page", { page, total: totalPages })}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  asChild>
                  <Link
                    href={`/challenges/${slug}/solutions?page=${page + 1}${
                      language ? `&language=${language}` : ""
                    }${sort ? `&sort=${sort}` : ""}`}>
                    {t("next")}
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
