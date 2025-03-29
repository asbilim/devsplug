"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "@/src/i18n/routing";
import { User, Home, Users } from "lucide-react";
import { motion } from "framer-motion";

export default function UserNotFound() {
  const t = useTranslations("UserProfile");

  return (
    <div className="container max-w-md mx-auto py-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}>
        <Card className="overflow-hidden border-none shadow-xl">
          <div className="relative h-32 bg-gradient-to-r from-primary/20 to-secondary/20 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
          </div>

          <div className="relative px-6 pb-6">
            <div className="flex justify-center">
              <motion.div
                className="h-20 w-20 rounded-full bg-background flex items-center justify-center border-4 border-background -mt-10 shadow-lg"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}>
                <User className="h-10 w-10 text-muted-foreground" />
              </motion.div>
            </div>

            <CardHeader className="text-center pt-4 px-0">
              <CardTitle className="text-2xl">{t("userNotFound")}</CardTitle>
            </CardHeader>

            <CardContent className="text-center space-y-6 px-0">
              <p className="text-muted-foreground">
                {t("userNotFoundDescription")}
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild variant="default" className="gap-2">
                  <Link href="/">
                    <Home className="h-4 w-4" />
                    {t("backHome")}
                  </Link>
                </Button>
                <Button asChild variant="outline" className="gap-2">
                  <Link href="/challenges">
                    <Users className="h-4 w-4" />
                    {t("exploreCommunity")}
                  </Link>
                </Button>
              </div>
            </CardContent>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
