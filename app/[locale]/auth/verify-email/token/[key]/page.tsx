"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useRouter } from "@/src/i18n/routing";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function VerifyEmailTokenPage({
  params,
}: {
  params: { key: string };
}) {
  const t = useTranslations("Auth.verifyEmail");
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/api/user/activate`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              token: params.key,
            }),
          }
        );

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || t("invalidToken"));
        }

        toast.success(t("success"));
        router.push("/auth/login");
      } catch (error: any) {
        setError(error?.message || t("error"));
      } finally {
        setIsVerifying(false);
      }
    };

    verifyEmail();
  }, [params.key, router, t]);

  if (isVerifying) {
    return (
      <div className="container flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">{t("verifying")}</CardTitle>
            <CardDescription>{t("verifyingDescription")}</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-6">
            <Loader2 className="h-8 w-8 animate-spin" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-destructive">
              {t("invalidToken")}
            </CardTitle>
            <CardDescription>{t("invalidTokenDescription")}</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center pt-6">
            <Button asChild>
              <Link href="/auth/login">{t("backToLogin")}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}
