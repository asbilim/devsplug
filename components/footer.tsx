"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/src/i18n/routing";
import { Github, Twitter } from "lucide-react";
import { motion } from "framer-motion";

export function Footer() {
  const t = useTranslations("Footer");

  const socialLinks = [
    {
      href: "https://twitter.com/asbilim",
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
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center">
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
          </motion.div>

          <div className="flex items-center space-x-4">
            {socialLinks.map((social, index) => (
              <motion.div
                key={social.label}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}>
                <Link
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-2xl bg-muted p-2 transition-colors hover:bg-muted/80 hover:text-primary"
                  aria-label={social.label}>
                  {social.icon}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
