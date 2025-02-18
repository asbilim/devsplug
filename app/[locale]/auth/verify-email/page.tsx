import { getTranslations } from "next-intl/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth } from "@/app/auth";
import { redirect } from "next/navigation";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: "Auth" });
  return {
    title: t("verifyEmail.title"),
  };
}

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  const session = await auth();
  if (session?.user) {
    redirect("/dashboard");
  }

  const t = await getTranslations("Auth");
  const token = searchParams.token;

  if (!token) {
    return (
      <div className="container flex min-h-[calc(100vh-4rem)] items-center justify-center py-8">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-destructive">
              {t("verifyEmail.invalidToken")}
            </CardTitle>
            <CardDescription>
              {t("verifyEmail.invalidTokenDescription")}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container flex min-h-[calc(100vh-4rem)] items-center justify-center py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">
            {t("verifyEmail.title")}
          </CardTitle>
          <CardDescription>{t("verifyEmail.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            action="/api/auth/verify-email"
            method="POST"
            className="space-y-4">
            <input type="hidden" name="token" value={token} />
            <div className="text-center text-sm text-muted-foreground">
              {t("verifyEmail.processing")}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
