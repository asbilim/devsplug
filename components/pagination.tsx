"use client";

import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter, usePathname } from "@/src/i18n/routing";

interface PaginationProps extends React.HTMLAttributes<HTMLDivElement> {
  currentPage: number;
  totalPages: number;
}

export function Pagination({
  currentPage,
  totalPages,
  className,
  ...props
}: PaginationProps) {
  const t = useTranslations("Home.pagination");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    return params.toString();
  };

  const handlePageChange = (page: number) => {
    router.push({
      query: {
        ...Object.fromEntries(searchParams.entries()),
        page: page.toString(),
      },
    });
  };

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-2 text-sm",
        className
      )}
      {...props}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage <= 1}>
        <ChevronLeft className="h-4 w-4 mr-2" />
        {t("prev")}
      </Button>
      <span className="text-muted-foreground">
        {t("page", { page: currentPage, total: totalPages })}
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}>
        {t("next")}
        <ChevronRight className="h-4 w-4 ml-2" />
      </Button>
    </div>
  );
}
