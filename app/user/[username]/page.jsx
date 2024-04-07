import { getUserInfo } from "@/data/get-score";
import { revalidateTag } from "next/cache";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import UserInfoDetails from "@/components/pages/user/user";
export default async function UserProfile({ params }) {
  revalidateTag("user");
  const { username } = params;
  const userInfo = await getUserInfo(decodeURIComponent(username));
  const error = userInfo?.error && true;

  const infos = JSON.parse(userInfo);


  return (
    <div className="flex flex-col">
      <Header />
      {error ? (
        <p>
          something went wrong , we {"can't"} fetch {username}
        </p>
      ) : (
        <UserInfoDetails user={infos} />
      )}
      <Footer />
    </div>
  );
}
