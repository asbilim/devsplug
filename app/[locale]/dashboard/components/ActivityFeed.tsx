"use client";

import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Trophy, Users, Award, Calendar } from "lucide-react";

// This is a mock component for now, in a real app you would fetch activity data from an API
export default function ActivityFeed() {
  const t = useTranslations("Dashboard");

  // Mock data for the activity feed
  const activities = [
    {
      id: 1,
      type: "challenge_completed",
      title: "Find the Maximum",
      timestamp: "2025-02-23T21:59:57.606001Z",
      points: 30,
    },
    {
      id: 2,
      type: "challenge_completed",
      title: "List Average",
      timestamp: "2025-02-23T21:59:59.509460Z",
      points: 25,
    },
    {
      id: 3,
      type: "new_follower",
      username: "johndoe",
      timestamp: "2025-02-22T18:30:00.000000Z",
      avatar: null,
    },
    {
      id: 4,
      type: "badge_earned",
      badge: "Problem Solver",
      timestamp: "2025-02-21T14:15:00.000000Z",
    },
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(date);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "challenge_completed":
        return <Trophy className="h-4 w-4 text-yellow-500" />;
      case "new_follower":
        return <Users className="h-4 w-4 text-blue-500" />;
      case "badge_earned":
        return <Award className="h-4 w-4 text-purple-500" />;
      default:
        return <Calendar className="h-4 w-4 text-gray-500" />;
    }
  };

  const getActivityMessage = (activity: any) => {
    switch (activity.type) {
      case "challenge_completed":
        return t("activity.challengeCompleted", {
          title: activity.title,
          points: activity.points,
        });
      case "new_follower":
        return t("activity.newFollower", { username: activity.username });
      case "badge_earned":
        return t("activity.badgeEarned", { badge: activity.badge });
      default:
        return t("activity.default");
    }
  };

  const getInitials = (name: string = "") => {
    if (!name) return "";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{t("activity.title")}</CardTitle>
            <CardDescription>{t("activity.description")}</CardDescription>
          </div>
          <div className="rounded-full bg-primary/10 p-2">
            <Calendar className="h-5 w-5 text-primary" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start space-x-4 rounded-md border p-4 transition-colors hover:bg-muted/50">
              {activity.type === "new_follower" ? (
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={activity.avatar || undefined}
                    alt={activity.username}
                  />
                  <AvatarFallback>
                    {getInitials(activity.username)}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  {getActivityIcon(activity.type)}
                </div>
              )}
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">
                  {getActivityMessage(activity)}
                </p>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Calendar className="mr-1 h-3 w-3" />
                  {formatDate(activity.timestamp)}
                </div>
              </div>
              {activity.type === "challenge_completed" && (
                <Badge variant="secondary" className="ml-auto">
                  +{activity.points} pts
                </Badge>
              )}
              {activity.type === "badge_earned" && (
                <Badge
                  variant="outline"
                  className="ml-auto bg-purple-500 text-white">
                  {activity.badge}
                </Badge>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
