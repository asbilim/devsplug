"use client";

import { useTranslations } from "next-intl";
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
import { Github, GitlabIcon, Mail, Loader2 } from "lucide-react";
import { register } from "@/app/actions/auth";
import { useFormState, useFormStatus } from "react-dom";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useRouter } from "@/src/i18n/routing";

type FormState = {
  error: string | null;
  success: boolean;
};

const initialState: FormState = {
  error: null,
  success: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  const t = useTranslations("Auth");

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {t("register.submitting")}
        </>
      ) : (
        t("register.submit")
      )}
    </Button>
  );
}

export default function RegisterPage() {
  const t = useTranslations("Auth");
  const [state, formAction] = useFormState<FormState, FormData>(
    register,
    initialState
  );
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<{
    github: boolean;
    google: boolean;
    gitlab: boolean;
  }>({
    github: false,
    google: false,
    gitlab: false,
  });

  const handleOAuthSignIn = async (
    provider: "github" | "google" | "gitlab"
  ) => {
    setIsLoading((prev) => ({ ...prev, [provider]: true }));
    try {
      await signIn(provider, {
        callbackUrl: "/dashboard",
      });
    } catch {
      toast.error(t("errors.oauth_signin"));
    } finally {
      setIsLoading((prev) => ({ ...prev, [provider]: false }));
    }
  };

  useEffect(() => {
    if (state.success) {
      toast.success(t("register.success"));
      router.push("/auth/verify-email");
    }
  }, [state.success]);

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
          <form action={formAction} className="space-y-4">
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
            {state?.error && (
              <div className="text-sm text-destructive">{state.error}</div>
            )}
            <SubmitButton />
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
              type="button">
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
              type="button">
              <Mail className="mr-2 h-4 w-4" />
              {t("login.google")}
            </Button>
            <Button
              variant="outline"
              onClick={() => handleOAuthSignIn("gitlab")}
              disabled={isLoading.gitlab}
              type="button">
              <GitlabIcon className="mr-2 h-4 w-4" />
              {t("login.gitlab")}
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
