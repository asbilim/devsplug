import { getTranslations } from "next-intl/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "@/src/i18n/routing";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: "Auth" });
  return {
    title: t("errors.title"),
  };
}

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const t = await getTranslations("Auth");
  const error = searchParams.error;

  const errorMessage = (() => {
    switch (error) {
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
  })();

  return (
    <div className="container flex min-h-[calc(100vh-4rem)] items-center justify-center py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-destructive">
            {t("errors.title")}
          </CardTitle>
          <CardDescription>{errorMessage}</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Button asChild>
            <Link href="/auth/login">{t("errors.try_again")}</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
