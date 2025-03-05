import { getTranslations } from "next-intl/server";
import { getChallenges } from "@/app/actions/challenges";
import { Pagination } from "@/components/pagination";
import { ChallengeCard } from "./client-components";

export async function ChallengesList({
  searchParams,
  locale,
}: {
  searchParams: {
    page?: string;
    difficulty?: string;
    category?: string;
    search?: string;
    tags?: string;
  };
  locale: string;
}) {
  const t = await getTranslations("Home");

  const params = {
    page: Number(searchParams?.page) || 1,
    ...(searchParams?.difficulty && {
      difficulty: String(searchParams.difficulty),
    }),
    ...(searchParams?.category && {
      category: String(searchParams.category),
    }),
    ...(searchParams?.search && {
      search: String(searchParams.search),
    }),
    ...(searchParams?.tags && {
      tags: String(searchParams.tags).split(","),
    }),
  };

  const challenges = await getChallenges(params);

  if (!challenges?.data?.length) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">{t("noResults")}</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {challenges.data.map((challenge) => (
          <ChallengeCard key={challenge.id} challenge={challenge} />
        ))}
        {challenges.data.length < 9 &&
          Array.from({ length: 9 - challenges.data.length }).map((_, index) => (
            <div key={`empty-${index}`} className="hidden lg:block" />
          ))}
      </div>
      <Pagination
        className="mt-8"
        currentPage={challenges.currentPage}
        totalPages={challenges.totalPages}
        locale={locale}
      />
    </>
  );
}
