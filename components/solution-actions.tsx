"use client";

import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SolutionActionsProps {
  code: string;
  language: string;
  filename?: string;
}

export function SolutionActions({
  code,
  language,
  filename = "solution",
}: SolutionActionsProps) {
  const t = useTranslations("Challenge.solutionDetails");

  const getFileExtension = (lang: string): string => {
    const langMap: Record<string, string> = {
      javascript: "js",
      typescript: "ts",
      python: "py",
      java: "java",
      cpp: "cpp",
      "c++": "cpp",
      c: "c",
      csharp: "cs",
      "c#": "cs",
      go: "go",
      rust: "rs",
      php: "php",
      ruby: "rb",
      swift: "swift",
      kotlin: "kt",
      scala: "scala",
      html: "html",
      css: "css",
      sql: "sql",
      bash: "sh",
      shell: "sh",
    };

    const normalizedLang = lang.toLowerCase();
    return langMap[normalizedLang] || "txt";
  };

  const handleDownload = () => {
    try {
      // Create file with proper extension
      const extension = getFileExtension(language);
      const fileContent = new Blob([code], { type: "text/plain" });
      const downloadLink = document.createElement("a");

      // Create download link
      downloadLink.download = `${filename}.${extension}`;
      downloadLink.href = window.URL.createObjectURL(fileContent);
      downloadLink.style.display = "none";

      // Trigger download
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      toast.success(t("downloadSuccess"));
    } catch (error) {
      console.error("Error downloading file:", error);
      toast.error(t("downloadError"));
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDownload}
            className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            <span className="sr-only md:not-sr-only md:inline-flex">
              {t("download")}
            </span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>{t("download")}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
