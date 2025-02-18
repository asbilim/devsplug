import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Link } from "@/src/i18n/routing";
import { Github, GitlabIcon, Mail } from "lucide-react";
import { auth } from "@/app/auth";
import { redirect } from "next/navigation";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: "Auth" });
  return {
    title: t("register.title"),
  };
}

export default async function RegisterPage() {
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
            {t("register.title")}
          </CardTitle>
          <CardDescription>{t("register.description")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form action="/api/auth/register" method="POST" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">{t("register.username")}</Label>
              <Input id="username" name="username" type="text" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t("register.email")}</Label>
              <Input id="email" name="email" type="email" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t("register.password")}</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">
                {t("register.confirmPassword")}
              </Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
              />
            </div>
            <Button type="submit" className="w-full">
              {t("register.submit")}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                {t("login.or")}
              </span>
            </div>
          </div>

          <div className="grid gap-2">
            <Button variant="outline" asChild>
              <Link href="/api/auth/signin/github">
                <Github className="mr-2 h-4 w-4" />
                {t("login.github")}
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/api/auth/signin/google">
                <Mail className="mr-2 h-4 w-4" />
                {t("login.google")}
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/api/auth/signin/gitlab">
                <GitlabIcon className="mr-2 h-4 w-4" />
                {t("login.gitlab")}
              </Link>
            </Button>
          </div>
        </CardContent>
        <CardFooter>
          <div className="text-sm text-muted-foreground">
            {t("register.haveAccount")}{" "}
            <Link
              href="/auth/login"
              className="underline underline-offset-4 hover:text-primary">
              {t("register.login")}
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
