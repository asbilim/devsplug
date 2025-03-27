import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeBlock } from "@/components/ui/code-block";
import { Markdown } from "@/components/markdown";
import { formatDate, formatRelativeTime } from "@/lib/utils";
import { Link } from "@/src/i18n/routing";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Calendar,
  Github,
  Heart,
  MessageSquare,
  User,
} from "lucide-react";
import { Metadata } from "next";
import { SolutionActions } from "@/components/solution-actions";
import { CopyButton } from "@/components/copy-button";
import { ShareSolution } from "@/components/share-solution";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getComments } from "@/app/actions/comments";
import { CommentSection } from "@/components/comments/CommentSection";
import { CommentsErrorBoundary } from "@/components/comments/CommentsErrorBoundary";

interface SolutionDetailParams {
  params: {
    slug: string;
    id: string;
    locale: string;
  };
}

interface Solution {
  id: number;
  user: {
    id: number;
    username: string;
    email?: string;
    profile?: string | null;
    title?: string;
  };
  challenge: number;
  code: string;
  documentation: string;
  language: string;
  status: string;
  created_at: string;
  is_private: boolean;
}

interface Challenge {
  id: number;
  title: string;
  slug: string;
  difficulty: string;
}

// Define a type for transformed comments
interface TransformedComment {
  id: number;
  author: {
    id: number;
    username: string;
    avatar: string | null;
  };
  content: string;
  createdAt: string;
  updatedAt?: string;
  likesCount: number;
  repliesCount: number;
  isLikedByUser: boolean;
  parent: number | null;
}

// Fetch challenge data with authentication
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

// Fetch solution data with authentication
async function getSolution(slug: string, id: string): Promise<Solution | null> {
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
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/challenges/listings/${slug}/solutions/${id}/`,
      {
        next: { revalidate: 60 },
        headers,
      }
    );

    if (!response.ok) {
      console.error(`Error fetching solution: ${response.status}`);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching solution:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: SolutionDetailParams): Promise<Metadata> {
  const { slug, id, locale } = params;
  const t = await getTranslations({ locale, namespace: "Challenge" });

  const solution = await getSolution(slug, id);
  const challenge = await getChallenge(slug);

  if (!solution || !challenge) {
    return {
      title: t("solutionDetails.notFound.title"),
      description: t("solutionDetails.notFound.description"),
    };
  }

  return {
    title: `${challenge.title} - ${t("solutionDetails.solutionBy", {
      username: solution.user.username,
    })}`,
    description: `${t("solutionDetails.language", {
      language: solution.language,
    })} - ${formatDate(solution.created_at)}`,
    openGraph: {
      type: "article",
      title: `${challenge.title} - ${t("solutionDetails.solutionBy", {
        username: solution.user.username,
      })}`,
      description: `${t("solutionDetails.language", {
        language: solution.language,
      })} - ${formatDate(solution.created_at)}`,
    },
  };
}

export default async function SolutionDetailPage({
  params,
}: SolutionDetailParams) {
  const t = await getTranslations("Challenge.solutionDetails");
  const tChallenge = await getTranslations("Challenge");
  const { slug, id, locale } = params;

  // Fetch real data
  const solution = await getSolution(slug, id);
  const challenge = await getChallenge(slug);

  // Get initial comments data with proper transformation
  let initialComments: TransformedComment[] = [];
  let commentCount = 0;

  if (solution && challenge) {
    try {
      // Just fetch the first page - our client-side pagination code will handle the rest
      const commentsData = await getComments(slug, id, 1, 10);

      // Use optional chaining and nullish coalescing to safely handle potentially undefined values
      const apiComments = commentsData?.comments ?? [];
      commentCount = commentsData?.pagination?.total ?? 0;

      // Transform API comments to match the expected format
      initialComments = apiComments.map((comment: any): TransformedComment => {
        return {
          id: comment?.id ?? 0,
          author: comment?.user
            ? {
                id: comment.user.id ?? 0,
                username: comment.user.username ?? "Anonymous",
                avatar: comment.user.profile ?? null,
              }
            : {
                id: 0,
                username: "Anonymous",
                avatar: null,
              },
          content: comment?.content ?? "",
          createdAt: comment?.created_at ?? new Date().toISOString(),
          updatedAt: comment?.updated_at,
          likesCount: comment?.likes_count ?? 0,
          repliesCount: 0, // Will be calculated by CommentSection
          isLikedByUser: comment?.is_liked_by_user ?? false,
          parent: comment?.parent,
        };
      });
    } catch (error) {
      console.error("Error prefetching comments:", error);
      // Keep default values in case of error
    }
  }

  // Handle 404
  if (!solution || !challenge) {
    return (
      <div className="container mx-auto py-12 px-4 md:px-6 text-center">
        <h1 className="text-3xl font-bold mb-4">{t("notFound.title")}</h1>
        <p className="text-muted-foreground mb-8">
          {t("notFound.description")}
        </p>
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 justify-center">
          <Button asChild>
            <Link href={`/challenges/${slug}`}>{t("backToChallenge")}</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/challenges/${slug}/solution`}>
              {t("submitYourSolution")}
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Button variant="ghost" size="sm" asChild className="group">
                <Link href={`/challenges/${slug}/solutions`}>
                  <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                  {t("backToSolutions")}
                </Link>
              </Button>
            </div>
            <h1 className="text-2xl font-bold mb-2">{challenge.title}</h1>
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <Badge variant="outline" className="capitalize">
                {tChallenge(`difficulty_${challenge.difficulty}`)}
              </Badge>
              <Badge variant="secondary" className="capitalize">
                {solution.language}
              </Badge>
              <div className="text-muted-foreground text-sm flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {formatRelativeTime(solution.created_at)}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <ShareSolution
              title={challenge.title}
              username={solution.user.username}
              language={solution.language}
            />
            <Button variant="outline" asChild>
              <Link href={`/challenges/${slug}`}>{t("backToChallenge")}</Link>
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-3 border-b">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border border-border">
                  <AvatarImage
                    src={solution.user.profile || ""}
                    alt={solution.user.username}
                  />
                  <AvatarFallback className="bg-primary/10 text-primary font-medium">
                    {solution.user.username.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{solution.user.username}</p>
                  <p className="text-sm text-muted-foreground">
                    {solution.user.title || t("defaultTitle")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="hidden md:flex">
                  <User className="h-4 w-4 mr-2" />
                  {t("viewProfile")}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-950/50">
                  <Heart className="h-4 w-4 mr-2" />
                  <span className="sr-only">{t("like")}</span>
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Tabs defaultValue="code">
          <TabsList className="mb-4">
            <TabsTrigger value="code" className="flex items-center gap-2">
              <Github className="h-4 w-4" />
              {t("code")}
            </TabsTrigger>
            {solution.documentation && (
              <TabsTrigger
                value="documentation"
                className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                {t("documentation")}
              </TabsTrigger>
            )}
          </TabsList>
          <TabsContent value="code" className="py-4">
            <Card>
              <CardHeader className="pb-3 flex flex-row justify-between items-center">
                <CardTitle className="text-base flex items-center gap-2">
                  {t("language", { language: solution.language })}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <SolutionActions
                    code={solution.code}
                    language={solution.language}
                    filename={`${challenge.title
                      .toLowerCase()
                      .replace(/\s+/g, "-")}-solution`}
                  />
                  <CopyButton text={solution.code} showLabel={true} />
                </div>
              </CardHeader>
              <CardContent>
                <CodeBlock
                  language={solution.language.toLowerCase()}
                  code={solution.code}
                  showLineNumbers
                />
              </CardContent>
              <CardFooter className="text-xs text-muted-foreground pt-2 pb-4 border-t">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {t("postedOn", { date: formatDate(solution.created_at) })}
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
          {solution.documentation && (
            <TabsContent value="documentation" className="py-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">
                    {t("documentation")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {solution.documentation ? (
                    <Markdown content={solution.documentation} />
                  ) : (
                    <div className="py-8 text-center text-muted-foreground">
                      {t("noDocumentation")}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>

        <CommentsErrorBoundary>
          <CommentSection
            challengeSlug={slug}
            solutionId={id}
            initialComments={initialComments}
            commentCount={commentCount}
          />
        </CommentsErrorBoundary>
      </div>
    </div>
  );
}
