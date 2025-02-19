"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Code2, Users2, CheckCircle2, Blocks } from "lucide-react";

const stats = [
  { key: "challenges", icon: Code2, value: "500+" },
  { key: "users", icon: Users2, value: "10K+" },
  { key: "solutions", icon: CheckCircle2, value: "50K+" },
  { key: "languages", icon: Blocks, value: "20+" },
];

export function CommunityStats() {
  const t = useTranslations("Home.stats");

  return (
    <div className="py-12 bg-muted/50">
      <div className="container">
        <h2 className="text-2xl font-bold text-center mb-8 font-mono">
          {t("title")}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center justify-center p-6 rounded-lg bg-card hover:bg-card/80 transition-colors">
              <stat.icon className="w-8 h-8 mb-2 text-primary" />
              <span className="text-2xl font-bold font-mono">{stat.value}</span>
              <span className="text-sm text-muted-foreground text-center">
                {t(stat.key)}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
