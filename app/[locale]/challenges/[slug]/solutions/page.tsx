import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/src/i18n/routing";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThumbsUp, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";

// Import Challenge actions
import { Challenge } from "@/app/types/challenge";

interface SolutionsPageParams {
  params: {
    slug: string;
    locale: string;
  };
  searchParams: {
    page?: string;
    language?: string;
  };
}

// Mock solution data for now
const mockSolutions = [
  {
    id: 1,
    user: {
      username: "johndoe",
      image: null,
      title: "Novice Developer",
    },
    language: "javascript",
    likes_count: 15,
    created_at: "2023-06-15T14:30:00Z",
    status: "completed",
  },
  {
    id: 2,
    user: {
      username: "alice_smith",
      image: null,
      title: "Senior Coder",
    },
    language: "python",
    likes_count: 8,
    created_at: "2023-06-17T09:15:00Z",
    status: "completed",
  },
  {
    id: 3,
    user: {
      username: "bob_developer",
      image: null,
      title: "Full Stack Developer",
    },
    language: "typescript",
    likes_count: 12,
    created_at: "2023-06-16T18:45:00Z",
    status: "completed",
  },
  {
    id: 4,
    user: {
      username: "sarah_coder",
      image: null,
      title: "Backend Specialist",
    },
    language: "java",
    likes_count: 7,
    created_at: "2023-06-18T10:30:00Z",
    status: "completed",
  },
  {
    id: 5,
    user: {
      username: "chris_dev",
      image: null,
      title: "Frontend Developer",
    },
    language: "typescript",
    likes_count: 19,
    created_at: "2023-06-14T11:45:00Z",
    status: "completed",
  },
  {
    id: 6,
    user: {
      username: "dev_ninja",
      image: null,
      title: "Code Ninja",
    },
    language: "go",
    likes_count: 21,
    created_at: "2023-06-12T16:20:00Z",
    status: "completed",
  },
];

// Mock challenge data
const mockChallenge = {
  id: 1,
  title: "Sum of Two Numbers",
  slug: "sum-of-two-numbers",
  difficulty: "easy",
  description: "Write a function that adds two numbers and returns the result",
};

export default async function ChallengeSolutionsPage({
  params,
  searchParams,
}: SolutionsPageParams) {
  const t = await getTranslations("Challenge");
  const { slug, locale } = params;
  const page = parseInt(searchParams.page || "1");
  const language = searchParams.language;

  // In a real implementation, we would fetch the challenge
  // const challenge = await getChallenge(slug);
  // if (!challenge) return notFound();

  const challenge = mockChallenge as Challenge; // Using mock data for now

  // In a real implementation, we would fetch solutions with pagination
  // const solutions = await getSolutions(challenge.id, { page, language });
  const solutions = mockSolutions; // Using mock data for now

  // Pagination mock data
  const totalPages = 3;

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="mb-6 flex items-center">
        <Button variant="ghost" size="sm" asChild className="mr-2">
          <Link href={`/challenges/${slug}`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Challenge
          </Link>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">{challenge.title} - Solutions</h1>
          <p className="text-muted-foreground">
            Browse solutions submitted by the community
          </p>
        </div>

        <Button asChild className="mt-4 md:mt-0">
          <Link href={`/challenges/${slug}/solution`}>
            Submit Your Solution
          </Link>
        </Button>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-background/80 backdrop-blur-sm p-6 rounded-lg shadow-lg z-10 text-center">
            <h2 className="text-3xl font-bold text-primary mb-2">
              Coming Soon
            </h2>
            <p className="text-muted-foreground">
              The full solutions listing page is under development
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 blur-sm">
          {solutions.map((solution) => (
            <Link
              key={solution.id}
              href={`/challenges/${slug}/solutions/${solution.id}`}
              className="block">
              <Card className="h-full hover:bg-accent/50 transition-colors">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage
                        src={solution.user.image || ""}
                        alt={solution.user.username}
                      />
                      <AvatarFallback>
                        {solution.user.username.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{solution.user.username}</p>
                      <p className="text-xs text-muted-foreground">
                        {solution.user.title}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <Badge variant="outline">{solution.language}</Badge>
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
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
          <div className="flex justify-center mt-8 blur-sm">
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" disabled={page <= 1} asChild>
                <Link
                  href={`/challenges/${slug}/solutions?page=${page - 1}${
                    language ? `&language=${language}` : ""
                  }`}>
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Link>
              </Button>

              <span className="text-sm text-muted-foreground px-2">
                Page {page} of {totalPages}
              </span>

              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                asChild>
                <Link
                  href={`/challenges/${slug}/solutions?page=${page + 1}${
                    language ? `&language=${language}` : ""
                  }`}>
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
