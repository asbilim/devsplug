import { getSingleProblem } from "@/data/get-problems";
import Header from "@/components/layout/header";
import ChallengeDetail from "@/components/layout/challenge-detail";
import { revalidateTag } from "next/cache";
import { getProblemRating } from "@/data/get-problems";
import Footer from "@/components/layout/footer";

export async function generateMetadata({ params }, parent) {
  revalidateTag("problem");
  const { slug } = params;
  const challenge = await getSingleProblem({ slug: slug });

  if (!challenge || !challenge?.title) {
    return {
      title: "Challenge Not Found - Devsplug",
      description:
        "Explore our range of programming challenges as this one couldn’t be found.",
      canonical: "https://www.devsplug.com/",
      image:
        "https://images.pexels.com/photos/208087/pexels-photo-208087.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      openGraph: {
        title: "Challenge Not Found - Devsplug",
        description:
          "Unable to locate the challenge in our catalog. Discover more at Devsplug!",
        url: "https://www.devsplug.com/",
        type: "website",
      },
      twitter: {
        card: "summary",
        site: "@devsplug",
        title: "Challenge Not Found - Devsplug",
        description:
          "Couldn't find the challenge? Explore other coding puzzles at Devsplug!",
        image:
          "https://images.pexels.com/photos/208087/pexels-photo-208087.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        imageAlt: "Challenge Not Found",
      },
    };
  }

  let mainChallengeImage = {
    url: challenge?.image,
    width: 800,
    height: 600,
    alt: `${challenge?.title} - Main Challenge Image`,
    type: "image/jpeg",
  };

  const truncatedDescription =
    challenge?.description?.length > 157
      ? challenge?.description?.substring(0, 157) + "..."
      : challenge?.description;

  return {
    title: `${challenge?.title} - Master It Now at Devsplug`,
    description: truncatedDescription,
    canonical: `https://www.devsplug.com/problems/details/${challenge?.slug}`,
    keywords:
      "Programming, Coding Challenge, Armstrong Number, Devsplug, Learn Coding",
    images: [mainChallengeImage],
    openGraph: {
      title: `${challenge?.title} - Take on This Coding Challenge at Devsplug`,
      description: truncatedDescription,
      url: `https://www.devsplug.com/challenges/${challenge?.slug}`,
      images: [mainChallengeImage],
      type: "article",
      siteName: "Devsplug",
    },
    twitter: {
      card: "summary_large_image",
      site: "@devsplug",
      title: `${challenge?.title} - Improve Your Skills at Devsplug`,
      description: truncatedDescription,
      image: challenge?.image,
      imageAlt: `${challenge?.title} - Challenge Image`,
    },
  };
}

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
