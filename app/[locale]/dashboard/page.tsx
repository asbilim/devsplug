"use client";

import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const t = useTranslations("Dashboard");
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session?.user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>
              {t("welcome", { name: session.user.username })}
            </CardTitle>
            <CardDescription>{t("welcomeDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground">
                  {t("email")}
                </div>
                <div>{session.user.email}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">
                  {t("score")}
                </div>
                <div>{session.user.score || 0}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">
                  {t("title")}
                </div>
                <div>{session.user.title || t("defaultTitle")}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="flex-1">
          <CardHeader>
            <CardTitle>{t("stats.title")}</CardTitle>
            <CardDescription>{t("stats.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground">
                  {t("stats.followers")}
                </div>
                <div>{session.user.followers_count || 0}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">
                  {t("stats.following")}
                </div>
                <div>{session.user.following_count || 0}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
