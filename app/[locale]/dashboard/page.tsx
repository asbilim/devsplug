"use client";

import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import DashboardLayout from "./components/DashboardLayout";
import { Skeleton } from "@/components/ui/skeleton";

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
    return (
      <div className="space-y-6">
        <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
          <div className="flex-1">
            <Skeleton className="h-[200px] w-full rounded-xl" />
          </div>
          <div className="flex-1">
            <Skeleton className="h-[200px] w-full rounded-xl" />
          </div>
        </div>
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  return <DashboardLayout />;
}
