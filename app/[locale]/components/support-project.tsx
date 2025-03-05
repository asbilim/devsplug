"use client";

import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Code, CreditCard } from "lucide-react";

export function SupportProject() {
  const t = useTranslations("Home.support");

  const handleSupportClick = () => {
    alert(t("notAvailable"));
  };

  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            {t("financial.title")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>{t("financial.description")}</p>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSupportClick} className="w-full">
            <CreditCard className="mr-2 h-4 w-4" />
            {t("financial.button")}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5 text-primary" />
            {t("code.title")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>{t("code.description")}</p>
        </CardContent>
        <CardFooter>
          <Button
            variant="outline"
            onClick={handleSupportClick}
            className="w-full">
            {t("code.button")}
          </Button>
        </CardFooter>
      </Card>

      <Card className="md:col-span-2 lg:col-span-1">
        <CardHeader>
          <CardTitle>{t("community.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{t("community.description")}</p>
        </CardContent>
        <CardFooter>
          <Button
            variant="secondary"
            onClick={handleSupportClick}
            className="w-full">
            {t("community.button")}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
