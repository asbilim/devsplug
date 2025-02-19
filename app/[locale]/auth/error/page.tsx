"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Link } from "@/src/i18n/routing";
import { useSearchParams } from "next/navigation";

const ERROR_MESSAGES = {
  AccessDenied: "errors.oauth_signin",
  Configuration: "errors.oauth_configuration",
  Default: "errors.default",
} as const;

export default function ErrorPage() {
  const t = useTranslations("Auth");
  const searchParams = useSearchParams();
  const error = searchParams.get("error") as keyof typeof ERROR_MESSAGES;

  const errorMessage = error
    ? t(ERROR_MESSAGES[error] || ERROR_MESSAGES.Default)
    : t(ERROR_MESSAGES.Default);

  return (
    <div className="container flex min-h-[calc(100vh-4rem)] items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-destructive">
          {t("errors.title")}
        </h1>
        <p className="mt-2 text-muted-foreground">{errorMessage}</p>
        <div className="mt-6 flex justify-center gap-4">
          <Button asChild>
            <Link href="/auth/login">{t("errors.try_again")}</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
