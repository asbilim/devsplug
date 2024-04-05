import { getSingleProblem } from "@/data/get-problems";
import Header from "@/components/layout/header";
import ChallengeDetail from "@/components/layout/challenge-detail";
import { revalidateTag } from "next/cache";
import { getProblemRating } from "@/data/get-problems";
import Footer from "@/components/layout/footer";
export default async function Page({ params }) {
  const { slug } = params;
  const problem = await getSingleProblem({ slug: slug });
  const ratings = await getProblemRating(slug);

  revalidateTag("problem");
  revalidateTag("ratings");

  return (
    <div>
      <Header />
      <ChallengeDetail problem={problem} ratings={ratings} slug={slug} />
      <Footer />
    </div>
  );
}
