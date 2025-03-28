"use client";

import { UserProfile } from "@/app/services/api";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Markdown } from "@/components/markdown";
import { Share2, Trophy, UserPlus, UserMinus, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { toggleFollowUser } from "@/app/services/api";
import { useSession } from "next-auth/react";

interface PublicUserProfileProps {
  profile: UserProfile;
}

export default function PublicUserProfile({ profile }: PublicUserProfileProps) {
  const t = useTranslations("UserProfile");
  const [isSharing, setIsSharing] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const { data: session } = useSession();

  // Get initials for avatar fallback
  const getInitials = (name: string = "") => {
    if (!name) return "";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Handle share button click
  const handleShare = async () => {
    try {
      setIsSharing(true);

      // Use the Web Share API if available
      if (navigator.share) {
        await navigator.share({
          title: `${profile.username}'s Profile | Devsplug`,
          text: `Check out ${profile.username}'s developer profile on Devsplug`,
          url: window.location.href,
        });
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(window.location.href);
        toast.success(t("profileLinkCopied"));
      }
    } catch (error) {
      console.error("Error sharing:", error);
      toast.error(t("shareFailed"));
    } finally {
      setIsSharing(false);
    }
  };

  // Handle follow/unfollow
  const handleFollowToggle = async () => {
    try {
      // Check if user is logged in
      if (!session?.user) {
        // If not logged in, redirect to login page
        toast.error(t("loginRequired"));
        return;
      }

      setFollowLoading(true);
      const action = isFollowing ? "unfollow" : "follow";
      const result = await toggleFollowUser(profile.username, action);

      if (result.success) {
        setIsFollowing(!isFollowing);

        if (!isFollowing) {
          toast.success(t("followSuccess", { username: profile.username }));
        } else {
          toast.success(t("unfollowSuccess", { username: profile.username }));
        }
      } else {
        toast.error(result.message || t("followError"));
      }
    } catch (error) {
      toast.error(t("followError"));
      console.error("Error toggling follow:", error);
    } finally {
      setFollowLoading(false);
    }
  };

  // Copy profile link
  const copyProfileLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success(t("profileLinkCopied"));
    } catch (error) {
      toast.error(t("copyFailed"));
    }
  };

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}>
        <Card className="overflow-hidden border-none shadow-xl">
          {/* Hero background with gradient overlay */}
          <div className="relative h-48 bg-gradient-to-r from-primary/30 to-secondary/30 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />

            {/* Share buttons positioned on top right */}
            <div className="absolute top-4 right-4 flex gap-2">
              <Button
                variant="secondary"
                size="icon"
                className="rounded-full backdrop-blur-md bg-background/50 shadow-md"
                onClick={copyProfileLink}>
                <Copy className="h-4 w-4" />
                <span className="sr-only">{t("copyLink")}</span>
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="rounded-full backdrop-blur-md bg-background/50 shadow-md"
                onClick={handleShare}
                disabled={isSharing}>
                <Share2 className="h-4 w-4" />
                <span className="sr-only">{t("shareProfile")}</span>
              </Button>
            </div>
          </div>

          <div className="relative px-6 pb-6">
            {/* Avatar - positioned to overlap the hero section */}
            <div className="flex justify-center">
              <Avatar className="h-32 w-32 rounded-full border-4 border-background -mt-16 shadow-lg">
                <AvatarImage
                  src={profile.profile || undefined}
                  alt={profile.username}
                  className="object-cover"
                />
                <AvatarFallback className="text-3xl">
                  {getInitials(profile.username)}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Main profile information */}
            <div className="mt-4 text-center">
              <h1 className="text-2xl font-bold">{profile.username}</h1>

              <div className="mt-1 text-muted-foreground">
                {profile.title || t("defaultTitle")}
              </div>

              <motion.div
                className="mt-3 inline-flex items-center px-3 py-1 rounded-full bg-primary/10"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 }}>
                <Trophy className="h-4 w-4 mr-2 text-primary" />
                <span className="text-sm font-medium">
                  {t("score")}:{" "}
                  <span className="font-bold">{profile.score || 0}</span>
                </span>
              </motion.div>

              {/* Follow button */}
              <div className="mt-6">
                <Button
                  variant={isFollowing ? "outline" : "default"}
                  className="w-full sm:w-auto min-w-[150px]"
                  onClick={handleFollowToggle}
                  disabled={followLoading}>
                  {followLoading ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent mr-2" />
                  ) : isFollowing ? (
                    <UserMinus className="mr-2 h-4 w-4" />
                  ) : (
                    <UserPlus className="mr-2 h-4 w-4" />
                  )}
                  {isFollowing ? t("unfollow") : t("follow")}
                </Button>
              </div>
            </div>

            {/* Portfolio/Bio section */}
            <CardContent className="px-0 pt-8 pb-0">
              {profile.bio ? (
                <div className="prose dark:prose-invert max-w-none prose-headings:scroll-mt-20 prose-img:rounded-lg prose-pre:bg-muted prose-pre:text-muted-foreground">
                  <Markdown content={profile.bio} />
                </div>
              ) : (
                <p className="text-muted-foreground italic text-center">
                  {t("noBio")}
                </p>
              )}
            </CardContent>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
