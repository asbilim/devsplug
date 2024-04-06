import { getSingleProblem, getSingleProblemQuiz } from "@/data/get-problems";
import Header from "@/components/layout/header";
import ChallengeDetail from "@/components/layout/challenge-detail";
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
      <ChallengeSolve problem={problem} quiz={problemQuiz} slug={slug} />
      <Footer />
    </div>
  );
}
