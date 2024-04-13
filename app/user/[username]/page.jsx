import { getUserInfo } from "@/data/get-score";
import { revalidateTag } from "next/cache";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import UserInfoDetails from "@/components/pages/user/user";
import { EmptyState } from "@/components/pages/states/empty";

export async function generateMetadata({ params }, parent) {
  revalidateTag("userProfile");
  const { username } = params;
  const us = await getUserInfo(decodeURIComponent(username));
  const error = us?.error && true;
  const user = !error && JSON.parse(us);

  // Handle case where user profile does not exist
  if (!user || !user?.username) {
    return {
      title: "User Profile Not Found - Devsplug",
      description:
        "The user profile you are trying to view does not exist or could not be retrieved.",
      canonical: "https://www.devsplug.com/",
      image:
        "https://images.pexels.com/photos/92129/pexels-photo-92129.jpeg?auto=compress&cs=tinysrgb&w=600",
      openGraph: {
        title: "User Profile Not Found - Devsplug",
        description:
          "Unable to locate the user profile. Explore more at Devsplug!",
        url: "https://www.devsplug.com/",
        type: "website",
      },
      twitter: {
        card: "summary",
        site: "@devsplug",
        title: "User Profile Not Found - Devsplug",
        description:
          "Couldn't find the user profile? Explore other developers at Devsplug!",
        image:
          "https://images.pexels.com/photos/92129/pexels-photo-92129.jpeg?auto=compress&cs=tinysrgb&w=600",
        imageAlt: "User Profile Not Found",
      },
    };
  }

  // Generate metadata for existing user
  const profileImageUrl =
    user?.profile ||
    "https://images.pexels.com/photos/92129/pexels-photo-92129.jpeg?auto=compress&cs=tinysrgb&w=600";
  const truncatedBio =
    user?.motivation?.length > 157
      ? user.bio.substring(0, 157) + "..."
      : user?.motivation;

  return {
    title: `${user?.username}'s Portfolio - Devsplug`,
    description:
      truncatedBio ||
      "View this developer's portfolio, including their bio, achievements, and contributions on Devsplug.",
    canonical: `https://www.devsplug.com/user/${encodeURIComponent(
      user?.username
    )}`,
    keywords:
      "User Portfolio, Devsplug, Developer Profile, Coding Contributions",
    images: [
      {
        url: profileImageUrl,
        width: 800,
        height: 600,
        alt: `${user.username}'s Profile Image`,
        type: "image/jpeg",
      },
    ],
    openGraph: {
      title: `${user?.username}'s Portfolio at Devsplug`,
      description:
        truncatedBio ||
        "Explore this developer's detailed portfolio on Devsplug, including personal achievements and coding contributions.",
      url: `https://www.devsplug.com/user/${encodeURIComponent(user.username)}`,
      images: [
        {
          url: profileImageUrl,
          width: 800,
          height: 600,
          alt: `${user?.username}'s Profile Image`,
        },
      ],
      type: "profile",
      siteName: "Devsplug",
    },
    twitter: {
      card: "summary_large_image",
      site: "@devsplug",
      title: `${user?.username}'s Portfolio - Devsplug`,
      description:
        truncatedBio ||
        "Check out this developer's portfolio on Devsplug, showcasing their skills and contributions.",
      image: profileImageUrl,
      imageAlt: `${user?.username}'s Profile Image`,
    },
  };
}

export default async function UserProfile({ params }) {
  revalidateTag("user");
  const { username } = params;
  const userInfo = await getUserInfo(decodeURIComponent(username));
  const error = userInfo?.error && true;

  const infos = !error && JSON.parse(userInfo);

  return (
    <div className="flex flex-col my-12">
      <Header />
      {error ? (
        <div className="flex items-center justify-center w-full min-h-screen">
          <EmptyState message="Please this user doesn't exist or we are currently unable to fetch the user at this time , review the name or try again later" />
        </div>
      ) : (
        <UserInfoDetails user={infos} />
      )}
      <Footer />
    </div>
  );
}
