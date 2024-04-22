import { revalidateTag } from "next/cache";
import { getSolutions, getSolutionsCommentsContent } from "@/data/get-problems";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import { EmptyState } from "@/components/pages/states/empty";
import SolutionDetail from "@/components/pages/community/details";
export default async function Page({ params }) {
  const { slug } = params;
  const posts = await getSolutions();
  const comments = await getSolutionsCommentsContent(slug);
  const datas = posts.filter((post) => post.unique_code == slug);
  const exists = datas.length || false;

  return (
    <div className="flex flex-col">
      <Header />
      {exists ? (
        <SolutionDetail comments={comments} {...datas[0]} />
      ) : (
        <div className="flex flex-col min-h-screen items-center justify-center">
          <EmptyState message="looks like you mistyped something , we can't actually find the solution you are looking for" />
        </div>
      )}

      <Footer />
    </div>
  );
}

export async function generateStaticParams() {
  revalidateTag("solutions");
  const posts = await getSolutions();

  return posts.map((post) => ({
    slug: post.unique_code,
  }));
}
