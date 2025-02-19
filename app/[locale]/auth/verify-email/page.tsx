"use client";

import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "@/src/i18n/routing";
import { Mail } from "lucide-react";

export default function VerifyEmailPage() {
  const t = useTranslations("Auth.verifyEmail");

  return (
    <div className="container flex min-h-[calc(100vh-4rem)] items-center justify-center py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Mail className="h-24 w-24 text-muted-foreground" />
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button asChild variant="outline" className="w-full">
            <Link href="/auth/login">{t("backToLogin")}</Link>
          </Button>
          <Button asChild variant="ghost" className="w-full">
            <Link href="/">{t("backToHome")}</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
