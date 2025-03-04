import { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Challenge } from "@/app/actions/challenges";
import { FullScreenEditor } from "./full-screen-editor";
import ClientLayout from "@/app/[locale]/client-layout";
import { Loader2 } from "lucide-react";

async function getChallenge(slug: string): Promise<Challenge | null> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/challenges/listings/${slug}/`,
      {
        next: { revalidate: 60 },
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error("Failed to fetch challenge");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching challenge:", error);
    return null;
  }
}

function LoadingSkeleton() {
  return (
    <div className="h-screen flex">
      {/* Left Panel Skeleton */}
      <div className="w-1/2 h-full border-r bg-background p-6">
        <div className="max-w-3xl mx-auto space-y-8 animate-pulse">
          <div className="flex items-center justify-between">
            <div className="h-8 w-64 bg-muted rounded-md" />
            <div className="h-8 w-24 bg-muted rounded-md" />
          </div>
          <div className="space-y-4">
            <div className="h-4 bg-muted rounded w-3/4" />
            <div className="h-4 bg-muted rounded w-full" />
            <div className="h-4 bg-muted rounded w-2/3" />
          </div>
          <div className="border rounded-lg p-4">
            <div className="h-6 w-32 bg-muted rounded mb-4" />
            <div className="space-y-2">
              <div className="h-8 bg-muted rounded" />
              <div className="h-8 bg-muted rounded" />
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel Skeleton */}
      <div className="w-1/2 h-full flex flex-col">
        <div className="border-b p-4 bg-background">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-9 w-[180px] bg-muted rounded-md" />
              <div className="h-9 w-[180px] bg-muted rounded-md" />
            </div>
            <div className="flex items-center gap-2">
              <div className="h-9 w-24 bg-muted rounded-md" />
              <div className="h-9 w-24 bg-muted rounded-md" />
            </div>
          </div>
        </div>
        <div className="flex-1 bg-muted/10" />
      </div>
    </div>
  );
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const challenge = await getChallenge(params.slug);

  if (!challenge) {
    return {
      title: "Challenge Not Found",
    };
  }

  return {
    title: `Devsplug | ${challenge.title} - Code Editor`,
    description: `Full-screen code editor for ${challenge.title}`,
  };
}

export default async function FullScreenPage({
  params,
}: {
  params: { slug: string; locale: string };
}) {
  const challenge = await getChallenge(params.slug);

  if (!challenge) {
    notFound();
  }

  return (
    <ClientLayout locale={params.locale}>
      <Suspense fallback={<LoadingSkeleton />}>
        <FullScreenEditor challenge={challenge} params={params} />
      </Suspense>
    </ClientLayout>
  );
}
