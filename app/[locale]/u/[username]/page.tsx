import { Metadata } from "next";
import { getUserPublicProfile } from "@/app/services/api";
import { getTranslations } from "next-intl/server";
import PublicUserProfile from "./components/PublicUserProfile";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: { username: string; locale: string };
}): Promise<Metadata> {
  const { locale, username } = params;
  const t = await getTranslations({ locale, namespace: "UserProfile" });

  try {
    const userProfile = await getUserPublicProfile(username);

    if (!userProfile) {
      return {
        title: t("userNotFound"),
        description: t("userNotFoundDescription"),
      };
    }

    return {
      title: `${userProfile.username} | ${
        userProfile.title || t("defaultTitle")
      }`,
      description: userProfile.bio
        ? userProfile.bio.substring(0, 160) +
          (userProfile.bio.length > 160 ? "..." : "")
        : t("defaultDescription", { username: userProfile.username }),
      openGraph: {
        type: "profile",
        title: `${userProfile.username} | ${
          userProfile.title || t("defaultTitle")
        }`,
        images: [
          {
            url: userProfile.profile || "/images/default-avatar.png",
            width: 300,
            height: 300,
            alt: userProfile.username,
          },
        ],
        username: userProfile.username,
      },
      twitter: {
        card: "summary",
        title: `${userProfile.username} | ${
          userProfile.title || t("defaultTitle")
        }`,
        description: userProfile.bio
          ? userProfile.bio.substring(0, 160) +
            (userProfile.bio.length > 160 ? "..." : "")
          : t("defaultDescription", { username: userProfile.username }),
        images: [userProfile.profile || "/images/default-avatar.png"],
      },
    };
  } catch (error) {
    return {
      title: t("userNotFound"),
      description: t("userNotFoundDescription"),
    };
  }
}

export default async function UserProfilePage({
  params,
}: {
  params: { username: string; locale: string };
}) {
  const { username } = params;
  const userProfile = await getUserPublicProfile(username);

  if (!userProfile) {
    notFound();
  }

  return <PublicUserProfile profile={userProfile} />;
}
