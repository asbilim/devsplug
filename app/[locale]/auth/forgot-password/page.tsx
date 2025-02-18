import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "@/src/i18n/routing";
import { auth } from "@/app/auth";
import { redirect } from "next/navigation";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: "Auth" });
  return {
    title: t("forgotPassword.title"),
  };
}

export default async function ForgotPasswordPage() {
  const session = await auth();
  if (session?.user) {
    redirect("/dashboard");
  }

  const t = await getTranslations("Auth");

  return (
    <div className="container flex min-h-[calc(100vh-4rem)] items-center justify-center py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">
            {t("forgotPassword.title")}
          </CardTitle>
          <CardDescription>{t("forgotPassword.description")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form
            action="/api/auth/forgot-password"
            method="POST"
            className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t("forgotPassword.email")}</Label>
              <Input id="email" name="email" type="email" required />
            </div>
            <Button type="submit" className="w-full">
              {t("forgotPassword.submit")}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <div className="text-sm text-muted-foreground">
            {t("forgotPassword.rememberPassword")}{" "}
            <Link
              href="/auth/login"
              className="underline underline-offset-4 hover:text-primary">
              {t("forgotPassword.login")}
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
