import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeBlock } from "@/components/ui/code-block";
import { Markdown } from "@/components/markdown";
import { formatDate } from "@/lib/utils";
import { Link } from "@/src/i18n/routing";

interface SolutionDetailParams {
  params: {
    slug: string;
    id: string;
    locale: string;
  };
}

// Mock solution data for now
const mockSolution = {
  id: 1,
  challenge: {
    id: 1,
    title: "Sum of Two Numbers",
    slug: "sum-of-two-numbers",
    difficulty: "easy",
  },
  user: {
    id: 1,
    username: "johndoe",
    image: null,
    title: "Code Master",
    bio: "Full-stack developer passionate about clean code",
    followers_count: 32,
    following: false,
  },
  code: `function sum(a, b) {
  // Add two numbers and return the result
  return a + b;
}`,
  documentation: `# Solution Explanation

I've implemented a simple function that takes two parameters:
- a: First number
- b: Second number

The function adds these two numbers and returns the result. This is the most straightforward approach to solving this challenge.

## Time Complexity
- O(1) - Constant time operation

## Space Complexity
- O(1) - No additional space required

## Edge Cases
- Handles negative numbers
- Handles zero values
- Works with floating-point numbers as well
  `,
  language: "javascript",
  is_private: false,
  created_at: "2023-06-15T14:30:00Z",
  updated_at: "2023-06-15T14:30:00Z",
  status: "completed",
  likes_count: 15,
  comments_count: 3,
};

export default async function SolutionDetailPage({
  params,
}: SolutionDetailParams) {
  const t = await getTranslations("Challenge");
  const { slug, id, locale } = params;

  // In a real implementation, we would fetch the solution
  // const solution = await getSolution(id);
  // if (!solution) return notFound();

  const solution = mockSolution; // Using mock data for now

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-background/80 backdrop-blur-sm p-6 rounded-lg shadow-lg z-10 text-center">
            <h2 className="text-3xl font-bold text-primary mb-2">
              Coming Soon
            </h2>
            <p className="text-muted-foreground">
              The full solution details page is under development
            </p>
          </div>
        </div>

        <div className="space-y-6 filter blur-sm">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold mb-2">
                {solution.challenge.title}
              </h1>
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="outline">
                  {t(`difficulty_${solution.challenge.difficulty}`)}
                </Badge>
                <span className="text-muted-foreground text-sm">
                  {formatDate(solution.created_at)}
                </span>
              </div>
            </div>
            <Button variant="outline" asChild>
              <Link href={`/challenges/${slug}`}>Back to Challenge</Link>
            </Button>
          </div>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
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
                    <p className="text-sm text-muted-foreground">
                      {solution.user.title}
                    </p>
                  </div>
                </div>
                <Button variant="outline">Follow</Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {solution.user.bio}
              </p>
              <div className="flex gap-4 mt-3">
                <div>
                  <span className="text-sm text-muted-foreground">
                    Followers
                  </span>
                  <p className="font-medium">{solution.user.followers_count}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="code">
            <TabsList className="mb-4">
              <TabsTrigger value="code">Code</TabsTrigger>
              <TabsTrigger value="documentation">Documentation</TabsTrigger>
            </TabsList>
            <TabsContent value="code" className="py-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">
                    Solution in {solution.language}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CodeBlock
                    language={solution.language}
                    code={solution.code}
                    showLineNumbers
                  />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="documentation" className="py-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Documentation</CardTitle>
                </CardHeader>
                <CardContent>
                  <Markdown content={solution.documentation} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                Discussion
                <Badge variant="secondary">{solution.comments_count}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center py-6 text-muted-foreground">
                Comments will be available soon
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
