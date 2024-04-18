import { revalidateTag } from "next/cache";
import { getSolutions } from "@/data/get-problems";

export default function Page({ params }) {
  const { slug } = params;

  return <p>hello community you are seeing details for {slug}</p>;
}

export async function generateStaticParams() {
  revalidateTag("solutions");
  const posts = await getSolutions();

  return posts.map((post) => ({
    slug: post.unique_code,
  }));
}
