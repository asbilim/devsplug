import Header from "@/components/layout/header";
import { getLeaderBoard } from "@/data/get-score";
import Footer from "@/components/layout/footer";
import { revalidateTag } from "next/cache";
import LeaderBoard from "@/components/pages/leaderboard/leaderboard";

export const metadata = {
  title: "Devsplug Leaderboard - See Top Coders Rankings",
  description:
    "Check out the leaderboard on Devsplug to see who tops the charts in coding challenges. Compete with peers and climb the ranks in our coding community!",
  canonical: "https://www.devsplug.com/leaderboard",
  openGraph: {
    title: "Compete and Rank - Devsplug Coding Leaderboard",
    description:
      "View the rankings and scores of top programmers on the Devsplug leaderboard. Join challenges, submit solutions, and see where you stand among the best!",
    url: "https://www.devsplug.com/leaderboard",
    type: "website",
    images: [
      {
        url: "https://images.pexels.com/photos/1181280/pexels-photo-1181280.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        width: 1200,
        height: 630,
        alt: "Top Coders on Devsplug Leaderboard",
        type: "image/jpeg",
      },
    ],
    siteName: "Devsplug",
  },
  twitter: {
    card: "summary_large_image",
    site: "@devsplug",
    title: "Top Programmer Rankings at Devsplug",
    description:
      "Are you among the top coders? Check the Devsplug leaderboard to find out. Compete in challenges and make your mark!",
    image:
      "https://images.pexels.com/photos/1181280/pexels-photo-1181280.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    imageAlt: "Devsplug Leaderboard",
  },
  robots: "index, follow",
  keywords:
    "Coding Leaderboard, Devsplug, Programming Competitions, Top Coders, Coding Rankings",
};

export default async function Dashboard() {
  revalidateTag("classement");
  const leaderBoard = await getLeaderBoard();


  return (
    <div className="flex flex-col mt-6">
      <Header />
      <LeaderBoard users={leaderBoard} />
      <Footer />
    </div>
  );
}
