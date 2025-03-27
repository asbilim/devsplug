"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CopyButtonProps {
  text: string;
  showLabel?: boolean;
  className?: string;
}

export function CopyButton({
  text,
  showLabel = false,
  className,
}: CopyButtonProps) {
  const t = useTranslations("Common");
  const tSolution = useTranslations("Challenge.solutionDetails");
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success(t("codeCopied"));

      // Reset copied state after 2 seconds
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy text: ", error);
      toast.error(t("copyFailed"));
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className={className}>
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            {showLabel && (
              <span className="sr-only md:not-sr-only md:inline-flex md:ml-2">
                {copied ? t("copied") : tSolution("copyCode")}
              </span>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {copied ? t("copied") : tSolution("copyCode")}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
