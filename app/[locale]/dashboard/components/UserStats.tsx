"use client";

import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Users, Trophy, Code, Star } from "lucide-react";

// Extend the session user type to include our custom properties
interface ExtendedUser {
  id?: string;
  username?: string;
  email?: string | null;
  image?: string | null;
  title?: string;
  score?: number;
  bio?: string;
  followers_count?: number;
  following_count?: number;
  completion_rate?: number;
  total_solutions?: number;
}

export default function UserStats() {
  const t = useTranslations("Dashboard");
  const { data: session } = useSession();
  const user = session?.user as ExtendedUser;

  if (!session?.user) {
    return null;
  }

  const stats = [
    {
      title: t("stats.followers"),
      value: user.followers_count || 0,
      icon: <Users className="h-4 w-4" />,
      progress: Math.min((user.followers_count || 0) * 10, 100),
    },
    {
      title: t("stats.following"),
      value: user.following_count || 0,
      icon: <Users className="h-4 w-4" />,
      progress: Math.min((user.following_count || 0) * 10, 100),
    },
    {
      title: t("stats.completionRate"),
      value: `${user.completion_rate || 0}%`,
      icon: <Trophy className="h-4 w-4" />,
      progress: user.completion_rate || 0,
    },
    {
      title: t("stats.totalSolutions"),
      value: user.total_solutions || 0,
      icon: <Code className="h-4 w-4" />,
      progress: Math.min((user.total_solutions || 0) * 5, 100),
    },
  ];

  return (
    <Card className="flex-1">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{t("stats.title")}</CardTitle>
            <CardDescription>{t("stats.description")}</CardDescription>
          </div>
          <div className="rounded-full bg-primary/10 p-2">
            <Star className="h-5 w-5 text-primary" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {stats.map((stat, index) => (
            <div key={index}>
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  {stat.icon}
                  <span>{stat.title}</span>
                </div>
                <div className="text-sm font-medium">{stat.value}</div>
              </div>
              <Progress
                value={stat.progress}
                className="h-2"
                indicatorClassName={
                  index % 4 === 0
                    ? "bg-blue-500"
                    : index % 4 === 1
                    ? "bg-green-500"
                    : index % 4 === 2
                    ? "bg-yellow-500"
                    : "bg-purple-500"
                }
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
