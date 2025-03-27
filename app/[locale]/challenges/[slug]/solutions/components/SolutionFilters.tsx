"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Filter, Languages } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useCallback } from "react";

interface SolutionFiltersProps {
  currentLanguage: string | null;
  currentSort: string;
  availableLanguages: string[];
  slug: string;
}

export function SolutionFilters({
  currentLanguage,
  currentSort,
  availableLanguages,
  slug,
}: SolutionFiltersProps) {
  const t = useTranslations("Challenge.solutions");
  const tChallenge = useTranslations("Challenge");
  const router = useRouter();

  // Helper function to build URL with query params
  const buildUrl = useCallback((params: Record<string, string | null>) => {
    const url = new URL(window.location.href);

    // First, clear existing relevant params
    url.searchParams.delete("language");
    url.searchParams.delete("sort");
    url.searchParams.set("page", "1"); // Reset to page 1 when changing filters

    // Then add new params
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        url.searchParams.set(key, value);
      }
    });

    console.log("Built URL:", url.toString());
    return url.toString();
  }, []);

  const handleLanguageChange = (value: string) => {
    console.log("Language changed to:", value);

    const languageParam = value === "all" ? null : value;
    const newUrl = buildUrl({
      language: languageParam,
      sort: currentSort,
    });

    router.push(newUrl);
  };

  const handleSortChange = (value: string) => {
    console.log("Sort changed to:", value);

    const newUrl = buildUrl({
      language: currentLanguage,
      sort: value,
    });

    router.push(newUrl);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6 items-start sm:items-center">
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">{t("filters")}</span>
      </div>

      <div className="flex gap-2 flex-wrap">
        <Select
          defaultValue={currentLanguage || "all"}
          onValueChange={handleLanguageChange}>
          <SelectTrigger className="w-[140px] h-9">
            <Languages className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
            <SelectValue placeholder={t("language")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              {tChallenge("languageGroup.all")}
            </SelectItem>
            <Separator className="my-1" />
            {availableLanguages.map((lang) => (
              <SelectItem key={lang} value={lang}>
                {tChallenge(`language.${lang.toLowerCase()}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select defaultValue={currentSort} onValueChange={handleSortChange}>
          <SelectTrigger className="w-[140px] h-9">
            <SelectValue placeholder={t("sort")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">{t("newest")}</SelectItem>
            <SelectItem value="oldest">{t("oldest")}</SelectItem>
            <SelectItem value="mostLiked">{t("mostLiked")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
