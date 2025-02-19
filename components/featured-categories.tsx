"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Code, Globe, Brain, Smartphone } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Link } from "@/src/i18n/routing";

const categories = [
  {
    key: "algorithms",
    icon: Code,
    href: "/challenges/algorithms",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    key: "web",
    icon: Globe,
    href: "/challenges/web",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    key: "ai",
    icon: Brain,
    href: "/challenges/ai",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    key: "mobile",
    icon: Smartphone,
    href: "/challenges/mobile",
    gradient: "from-orange-500 to-red-500",
  },
];

export function FeaturedCategories() {
  const t = useTranslations("Home.featured");

  return (
    <section className="py-16">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold font-mono mb-3">{t("title")}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t("description")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.key}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}>
              <Link href={category.href} className="block h-full">
                <Card className="h-full overflow-hidden group hover:shadow-lg transition-all duration-200">
                  <CardHeader className="relative">
                    <div
                      className={`absolute inset-0 opacity-10 bg-gradient-to-br ${category.gradient}`}
                    />
                    <category.icon className="w-8 h-8 mb-2 text-primary" />
                    <CardTitle className="font-mono group-hover:text-primary transition-colors">
                      {t(`categories.${category.key}.title`)}
                    </CardTitle>
                    <CardDescription>
                      {t(`categories.${category.key}.description`)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <span className="font-mono">→ {t("explore")}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
