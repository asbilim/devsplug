"use client";

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
import { Separator } from "@/components/ui/separator";
import { Link } from "@/src/i18n/routing";
import { Github, GitlabIcon, Mail, Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTranslations } from "use-intl";
import { useState } from "react";

export default function LoginPage() {
  const t = useTranslations("Auth");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<{
    credentials: boolean;
    github: boolean;
    google: boolean;
    gitlab: boolean;
  }>({
    credentials: false,
    github: false,
    google: false,
    gitlab: false,
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading((prev) => ({ ...prev, credentials: true }));
    const formData = new FormData(e.currentTarget);

    try {
      const result = await signIn("credentials", {
        username: formData.get("username"),
        password: formData.get("password"),
        redirect: false,
        callbackUrl: "/dashboard",
      });

      if (!result?.error) {
        router.push(result?.url ?? "/dashboard");
      } else {
        console.error("Authentication error:", result.error);
      }
    } catch (error) {
      console.error("Sign in error:", error);
    } finally {
      setIsLoading((prev) => ({ ...prev, credentials: false }));
    }
  };

  const handleOAuthSignIn = async (
    provider: "github" | "google" | "gitlab"
  ) => {
    setIsLoading((prev) => ({ ...prev, [provider]: true }));
    try {
      await signIn(provider, { callbackUrl: "/dashboard" });
    } catch (error) {
      console.error(`${provider} sign in error:`, error);
    } finally {
      setIsLoading((prev) => ({ ...prev, [provider]: false }));
    }
  };

  return (
    <div className="container flex min-h-[calc(100vh-4rem)] items-center justify-center py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">
            {t("login.title")}
          </CardTitle>
          <CardDescription>{t("login.description")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">{t("login.username")}</Label>
              <Input id="username" name="username" type="text" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t("login.password")}</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading.credentials}>
              {isLoading.credentials ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("login.loading")}
                </>
              ) : (
                t("login.submit")
              )}
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
            <Button
              variant="outline"
              onClick={() => handleOAuthSignIn("github")}
              disabled={isLoading.github}
              className="w-full">
              {isLoading.github ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Github className="mr-2 h-4 w-4" />
              )}
              {t("login.github")}
            </Button>
            <Button
              variant="outline"
              onClick={() => handleOAuthSignIn("google")}
              disabled={isLoading.google}
              className="w-full">
              {isLoading.google ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Mail className="mr-2 h-4 w-4" />
              )}
              {t("login.google")}
            </Button>
            <Button
              variant="outline"
              onClick={() => handleOAuthSignIn("gitlab")}
              disabled={isLoading.gitlab}
              className="w-full">
              {isLoading.gitlab ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <GitlabIcon className="mr-2 h-4 w-4" />
              )}
              {t("login.gitlab")}
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex flex-wrap items-center justify-between gap-2">
          <div className="text-sm text-muted-foreground">
            <Link
              href="/auth/register"
              className="underline underline-offset-4 hover:text-primary">
              {t("login.register")}
            </Link>
          </div>
          <div className="text-sm text-muted-foreground">
            <Link
              href="/auth/forgot-password"
              className="underline underline-offset-4 hover:text-primary">
              {t("login.forgotPassword")}
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
