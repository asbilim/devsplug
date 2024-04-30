import {
  getProblems,
  getSingleProblem,
  getSingleProblemQuiz,
} from "@/data/get-problems";
import Header from "@/components/layout/header";
import { Suspense } from "react";
import ChallengeLoading from "@/components/pages/states/challenge-loading";
import { revalidateTag } from "next/cache";
import ChallengeSolve from "@/components/layout/challenge-solve";
import Footer from "@/components/layout/footer";

export default async function Page({ params }) {
  const { slug } = params;
  const problem = await getSingleProblem({ slug: slug });
  const problemQuiz = await getSingleProblemQuiz({ slug: slug });

  revalidateTag("problem");

  return (
    <div>
      <Header />
      <Suspense fallback={<ChallengeLoading />}>
        <ChallengeSolve problem={problem} quiz={problemQuiz} slug={slug} />
      </Suspense>
      <Footer />
    </div>
  );
}

export async function generateStaticParams() {
  revalidateTag("problems");

  const problems = await getProblems();

  return problems.flatMap((problem) =>
    problem.problems.map((subProblem) => ({
      slug: subProblem.slug,
    }))
  );
}
