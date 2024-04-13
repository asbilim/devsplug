import Header from "@/components/layout/header";
import ChallengeComponent from "@/components/pages/challenges";
import { revalidateTag } from "next/cache";
import { getProblems } from "@/data/get-problems";
import Footer from "@/components/layout/footer";
import { Suspense } from "react";
import ChallengeLoading from "@/components/pages/states/challenge-loading";

export const metadata = {
  title: "Explore Programming Challenges by Category - Devsplug",
  description:
    "Dive into various categories of programming challenges designed to enhance your coding skills and solve complex problems. Enroll now and start coding!",
  canonical: "https://www.devsplug.com/challenges/categories",
  openGraph: {
    title: "Browse Coding Challenges by Category - Devsplug",
    description:
      "Choose from a range of categories like Algorithms, Data Structures, and more to find programming challenges that suit your skill level and interests.",
    url: "https://www.devsplug.com/challenges/",
    type: "website",
    images: [
      {
        url: "https://images.pexels.com/photos/1181280/pexels-photo-1181280.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        width: 1200,
        height: 630,
        alt: "Explore Categories of Programming Challenges at Devsplug",
        type: "image/jpeg",
      },
    ],
    siteName: "Devsplug",
  },
  twitter: {
    card: "summary_large_image",
    site: "@devsplug",
    title: "Find Your Next Coding Challenge by Category at Devsplug",
    description:
      "Master new programming skills by engaging with tailored challenges across different categories. Start your learning journey today!",
    image:
      "https://images.pexels.com/photos/1181280/pexels-photo-1181280.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    imageAlt: "Categories of Programming Challenges at Devsplug",
  },
  robots: "index, follow",
  keywords:
    "Programming Challenges, Coding Categories, Devsplug, Learn Coding, Algorithms, Data Structures",
};

export default async function Challenges() {
  revalidateTag("problems");
  const problems = await getProblems();
  return (
    <div className="flex flex-col">
      <Header />
      <Suspense fallback={<ChallengeLoading />}>
        <ChallengeComponent problems={problems} />
      </Suspense>
      <Footer />
    </div>
  );
}
