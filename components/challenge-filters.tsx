"use client";

import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import debounce from "lodash/debounce";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { useRouter, usePathname } from "@/src/i18n/routing";

const difficulties = ["easy", "medium", "hard"] as const;
const categories = [
  "programming-basics",
  "modular-programming",
  "object-oriented-programming",
] as const;

export function ChallengeFilters() {
  const t = useTranslations("Home.filters");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(
    searchParams?.get("search") || ""
  );

  const createQueryString = useCallback(
    (params: Record<string, string | null>) => {
      const newSearchParams = new URLSearchParams(searchParams?.toString());

      Object.entries(params).forEach(([key, value]) => {
        if (value === null) {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, value);
        }
      });

      return newSearchParams.toString();
    },
    [searchParams]
  );

  // Debounced search update
  const debouncedUpdateSearch = useCallback(
    debounce((value: string) => {
      const queryString = createQueryString({ search: value || null });
      router.push(`${pathname}?${queryString}`);
    }, 300),
    [createQueryString, pathname, router]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    debouncedUpdateSearch(value);
  };

  const updateFilters = (key: string, value: string | null) => {
    const queryString = createQueryString({ [key]: value });
    router.push(`${pathname}?${queryString}`);
  };

  const clearFilters = () => {
    router.push(pathname);
  };

  const currentDifficulty = searchParams?.get("difficulty") || "";
  const currentCategory = searchParams?.get("category") || "";

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("search")}
              className="pl-8"
              value={searchValue}
              onChange={handleSearchChange}
            />
          </div>
        </div>
        <Select
          value={currentDifficulty || "all"}
          onValueChange={(value) =>
            updateFilters("difficulty", value === "all" ? null : value)
          }>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t("difficulty")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("all")}</SelectItem>
            {difficulties.map((difficulty) => (
              <SelectItem key={difficulty} value={difficulty}>
                {t(difficulty)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={currentCategory || "all"}
          onValueChange={(value) =>
            updateFilters("category", value === "all" ? null : value)
          }>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t("category")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("all")}</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {t(`categories.${category}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {(currentDifficulty || currentCategory || searchValue) && (
          <Button variant="ghost" className="gap-2" onClick={clearFilters}>
            {t("clear")}
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
