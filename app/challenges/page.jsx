import Header from "@/components/layout/header";
import ChallengeComponent from "@/components/pages/challenges";
import { revalidateTag } from "next/cache";
import { getProblems } from "@/data/get-problems";
import Footer from "@/components/layout/footer";
export default async function Challenges() {
  revalidateTag("problems");
  const problems = await getProblems();
  return (
    <div className="flex flex-col">
      <Header />
      <ChallengeComponent problems={problems} />
      <Footer />
    </div>
  );
}
