import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import CommunityContent from "@/components/pages/community/content";
import { revalidateTag } from "next/cache";
import { getSolutions } from "@/data/get-problems";

export const metadata = {
  title: "Community: Share Your Code and Solutions - Devsplug",
  description:
    "Join the Devsplug community, where developers share code snippets, solutions, and insights from challenges they've solved. Connect, learn, and grow together!",
  canonical: "https://www.devsplug.com/community",
  openGraph: {
    title: "Join the Devsplug Community - Share Code and Solutions",
    description:
      "Contribute to the Devsplug community by sharing solutions to challenges. Discuss, collaborate, and learn from others to enhance your coding skills.",
    url: "https://www.devsplug.com/community",
    type: "website",
    images: [
      {
        url: "https://images.pexels.com/photos/3812964/pexels-photo-3812964.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        width: 1200,
        height: 630,
        alt: "Devsplug Community: Share Code and Solutions",
        type: "image/jpeg",
      },
    ],
    siteName: "Devsplug",
  },
  twitter: {
    card: "summary_large_image",
    site: "@devsplug",
    title: "Share Your Code and Solutions at the Devsplug Community",
    description:
      "Collaborate with fellow developers by sharing code snippets and solutions. Gain insights from peers, improve your skills, and contribute to the community.",
    image:
      "https://images.pexels.com/photos/3812964/pexels-photo-3812964.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    imageAlt: "Devsplug Community: Share Code and Solutions",
  },
  robots: "index, follow",
  keywords:
    "Devsplug Community, Share Code, Coding Solutions, Programming Insights, Coding Collaboration, Developer Community",
};

export default async function community() {
  revalidateTag("solutions");
  revalidateTag("comments");
  revalidateTag("likes");
  revalidateTag("dislikes");
  const solutions = await getSolutions();
  return (
    <div className="flex flex-col">
      <Header />
      <CommunityContent solutions={solutions} />
      <Footer />
    </div>
  );
}
