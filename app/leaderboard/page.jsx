import Header from "@/components/layout/header";
import { getLeaderBoard } from "@/data/get-score";
import Footer from "@/components/layout/footer";
import { revalidateTag } from "next/cache";
import LeaderBoard from "@/components/pages/leaderboard/leaderboard";
export default async function Dashboard() {
  revalidateTag("classement");
  const leaderBoard = await getLeaderBoard();

  return (
    <div className="flex flex-col">
      <Header />
      <LeaderBoard users={leaderBoard} />
      <Footer />
    </div>
  );
}
