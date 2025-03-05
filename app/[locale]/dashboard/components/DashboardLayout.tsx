"use client";

import { useTranslations } from "next-intl";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserProfile from "./UserProfile";
import UserStats from "./UserStats";
import UserChallenges from "./UserChallenges";
import ActivityFeed from "./ActivityFeed";
import { Trophy, Activity, Settings } from "lucide-react";

export default function DashboardLayout() {
  const t = useTranslations("Dashboard");

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
        <UserProfile />
        <UserStats />
      </div>

      <Tabs defaultValue="challenges" className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:w-auto">
          <TabsTrigger value="challenges" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            <span className="hidden sm:inline-block">
              {t("tabs.challenges")}
            </span>
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            <span className="hidden sm:inline-block">{t("tabs.activity")}</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline-block">{t("tabs.settings")}</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="challenges" className="mt-6">
          <UserChallenges />
        </TabsContent>
        <TabsContent value="activity" className="mt-6">
          <ActivityFeed />
        </TabsContent>
        <TabsContent value="settings" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Settings content will go here in the future */}
            <div className="col-span-full flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
              <Settings className="mb-4 h-8 w-8 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-medium">
                {t("settings.title")}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t("settings.comingSoon")}
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
