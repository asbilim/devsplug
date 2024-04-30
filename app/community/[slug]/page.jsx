import { revalidateTag } from "next/cache";
import { getSolutions, getSolutionsCommentsContent } from "@/data/get-problems";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import { EmptyState } from "@/components/pages/states/empty";
import SolutionDetail from "@/components/pages/community/details";

export async function generateMetadata({ params }, parent) {
  const { slug } = params;
  const posts = await getSolutions();
  const datas = posts.filter((post) => post.unique_code == slug);
  const exists = datas.length || false;

  if (!exists) {
    return {
      title: "Solution Not Found - Devsplug",
      description:
        "Explore our range of solutions for various challenges, even if this one isn't found.",
      canonical: "https://www.devsplug.com/community",
      robots: "index, follow",
      image:
        "https://images.pexels.com/photos/3184298/pexels-photo-3184298.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      openGraph: {
        title: "Solution Not Found - Devsplug",
        description:
          "Couldn't find the solution you were looking for? Explore more solutions in the Devsplug community.",
        url: "https://www.devsplug.com/community",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        site: "@devsplug",
        title: "Solution Not Found - Devsplug",
        description:
          "Discover more solutions at Devsplug, even if this one is unavailable.",
        image:
          "https://images.pexels.com/photos/3184298/pexels-photo-3184298.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        imageAlt: "Solution Not Found",
      },
    };
  }

  const challenge = datas[0].problem_item;
  const solution = datas[0];
  const user = datas[0]?.user;

  const truncatedDescription =
    datas[0]?.description?.length > 157
      ? datas[0]?.description?.substring(0, 157) + "..."
      : datas[0]?.description;
  let solutionImage = {
    url:
      user?.image ||
      "https://images.pexels.com/photos/3184298/pexels-photo-3184298.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    width: 800,
    height: 600,
    alt: `${user?.username} - Solution author`,
    type: "image/jpeg",
  };

  return {
    title: `${solution?.name} - ${challenge?.title} Solution at Devsplug`,
    description: truncatedDescription,
    canonical: `https://www.devsplug.com/community/${solution?.unique_code}`,
    keywords:
      "Coding Solution, Devsplug, Programming Challenge Solution, Code Functions, Developer Community",
    images: [solutionImage],
    openGraph: {
      title: `${solution?.name} - ${challenge?.title} Solution at Devsplug`,
      description: truncatedDescription,
      url: `https://www.devsplug.com/solutions/${solution?.unique_code}`,
      images: [solutionImage],
      type: "article",
      siteName: "Devsplug",
    },
    robots: "index, follow",
    twitter: {
      card: "summary_large_image",
      site: "@devsplug",
      title: `${solution?.name} - ${challenge?.title} Solution by  ${user?.username}`,
      description: truncatedDescription,
      image: solutionImage.url,
      imageAlt: `${user?.username} - Solution Image`,
    },
  };
}

export default async function Page({ params }) {
  const { slug } = params;
  const posts = await getSolutions();
  const comments = await getSolutionsCommentsContent(slug);
  const datas = posts.filter((post) => post.unique_code == slug);
  const exists = datas.length || false;

  console.log(datas[0].user);

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
