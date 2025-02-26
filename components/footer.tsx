"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/src/i18n/routing";
import { Github, Twitter } from "lucide-react";

export function Footer() {
  const t = useTranslations("Footer");

  const socialLinks = [
    {
      href: "https://x.com/iampaullilian",
      icon: <Twitter className="h-5 w-5" />,
      label: "Twitter",
    },
    {
      href: "https://github.com/asbilim",
      icon: <Github className="h-5 w-5" />,
      label: "GitHub",
    },
  ];

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/75 backdrop-blur-md supports-[backdrop-filter]:bg-background/40">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <p className="text-sm text-muted-foreground">
              {t("copyright")} © {new Date().getFullYear()}{" "}
              <Link
                href="https://github.com/asbilim"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium underline underline-offset-4 transition-colors hover:text-primary">
                asbilim
              </Link>
              . {t("rights")}
            </p>
          </div>

          <div className="flex items-center space-x-4">
            {socialLinks.map((social) => (
              <div key={social.label}>
                <Link
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-2xl bg-muted p-2"
                  aria-label={social.label}>
                  {social.icon}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
