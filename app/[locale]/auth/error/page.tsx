"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/src/i18n/routing";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

function ErrorCard() {
  const t = useTranslations("Auth");
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case "Configuration":
        return t("errors.configuration");
      case "AccessDenied":
        return t("errors.access_denied");
      case "Verification":
        return t("errors.verification");
      case "OAuthSignin":
        return t("errors.oauth_signin");
      case "OAuthCallback":
        return t("errors.oauth_callback");
      case "OAuthCreateAccount":
        return t("errors.oauth_create_account");
      case "EmailCreateAccount":
        return t("errors.email_create_account");
      case "Callback":
        return t("errors.callback");
      case "OAuthAccountNotLinked":
        return t("errors.oauth_account_not_linked");
      case "EmailSignin":
        return t("errors.email_signin");
      case "CredentialsSignin":
        return t("errors.credentials_signin");
      case "SessionRequired":
        return t("errors.session_required");
      default:
        return t("errors.default");
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="flex items-center gap-2 text-2xl font-bold tracking-tight text-destructive">
          <AlertCircle className="h-6 w-6" />
          {t("errors.title")}
        </CardTitle>
        <CardDescription>{getErrorMessage(error)}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button asChild className="w-full">
          <Link href="/auth/login">{t("errors.try_again")}</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

export default function ErrorPage() {
  return (
    <div className="container flex h-[calc(100vh-4rem)] items-center justify-center">
      <Suspense
        fallback={
          <div className="w-full max-w-md space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        }>
        <ErrorCard />
      </Suspense>
    </div>
  );
}
