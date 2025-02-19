"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Link } from "@/src/i18n/routing";
import { useCallback } from "react";
import Particles from "react-tsparticles";
import type { Engine } from "tsparticles-engine";
import { loadSlim } from "tsparticles-slim";
import { NotFoundSVG } from "@/components/not-found-svg";

export default function NotFound() {
  const t = useTranslations("NotFound");

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center">
      {/* Particles Background */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          background: {
            opacity: 0,
          },
          particles: {
            color: {
              value: "var(--primary)",
            },
            links: {
              color: "var(--primary)",
              distance: 150,
              enable: true,
              opacity: 0.2,
              width: 1,
            },
            move: {
              enable: true,
              speed: 1,
            },
            number: {
              density: {
                enable: true,
                area: 800,
              },
              value: 80,
            },
            opacity: {
              value: 0.3,
            },
            size: {
              value: { min: 1, max: 3 },
            },
          },
        }}
        className="absolute inset-0"
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center space-y-8 text-center">
        <div className="w-full max-w-[600px] px-4">
          <NotFoundSVG className="h-auto w-full" />
        </div>
        <div className="space-y-4">
          <h1 className="font-mono text-4xl font-bold tracking-tight md:text-6xl">
            {t("title")}
          </h1>
          <p className="mx-auto max-w-[500px] text-muted-foreground">
            {t("description")}
          </p>
        </div>
        <Button asChild size="lg">
          <Link href="/">{t("backHome")}</Link>
        </Button>
      </div>
    </div>
  );
}
