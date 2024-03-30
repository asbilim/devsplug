import { getSingleProblem } from "@/data/get-problems";
import Header from "@/components/layout/header";
import ChallengeDetail from "@/components/layout/challenge-detail";
import { revalidateTag } from "next/cache";
export default async function Page({ params }) {
  const { slug } = params;
  const problem = await getSingleProblem({ slug: slug });
  revalidateTag("problem");
  return (
    <div>
      <Header />
      <ChallengeDetail problem={problem} />
    </div>
  );
}
