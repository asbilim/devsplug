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
];

export default async function ChallengePage({
  params,
}: {
  params: { slug: string; locale: string };
}) {
  const t = await getTranslations();
  const tChallenge = await getTranslations("Challenge");
  const challenge = await getChallenge(params.slug);

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
            <h2 className="text-2xl font-bold">{t("solutions.title")}</h2>
          </div>
          <Link
            href={`/challenges/${params.slug}/solutions`}
            className="flex items-center text-primary hover:text-primary/80 transition-all gap-1 font-medium">
            {t("solutions.viewAll")}
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockSolutions.map((solution) => (
            <Link
              key={solution.id}
              href={`/challenges/${params.slug}/solutions/${solution.id}`}
              className="block group">
              <Card className="h-full overflow-hidden border-muted/20 bg-background hover:shadow-md hover:border-primary/20 transition-all duration-300">
                <CardHeader className="bg-muted/10 pb-2 group-hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <Avatar className="border-2 border-background group-hover:border-primary/20 transition-colors">
                      <AvatarImage
                        src={solution.user.image || ""}
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
                        {solution.user.title}
                      </p>
                    </div>
                    <div className="ml-auto flex items-center">
                      <Badge
                        variant="outline"
                        className="bg-primary/5 hover:bg-primary/10">
                        {solution.language}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="flex flex-col space-y-3">
                    <div className="h-16 w-full bg-muted/20 rounded overflow-hidden relative">
                      <div className="absolute inset-0 opacity-30 flex items-center justify-center text-muted-foreground">
                        <Code className="h-8 w-8" />
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary/30 group-hover:bg-primary transition-colors" />
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <CalendarIcon className="h-3.5 w-3.5" />
                        <span className="text-xs">
                          {new Date(solution.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <ThumbsUp className="h-3.5 w-3.5" />
                        <span className="text-xs font-medium">
                          {solution.likes_count}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
