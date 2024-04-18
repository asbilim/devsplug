import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import CommunityContent from "@/components/pages/community/content";
import { revalidateTag } from "next/cache";
import { getSolutions } from "@/data/get-problems";
export default async function community() {
  revalidateTag("solutions");
  const solutions = await getSolutions();
  return (
    <div className="flex flex-col">
      <Header />
      <CommunityContent solutions={solutions} />
      <Footer />
    </div>
  );
}
