"use client";

import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Share, Twitter, Facebook, Linkedin, Mail, Check } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

interface ShareSolutionProps {
  title: string;
  username: string;
  language: string;
}

export function ShareSolution({
  title,
  username,
  language,
}: ShareSolutionProps) {
  const t = useTranslations("Challenge.solutionDetails");
  const [copied, setCopied] = useState(false);

  // Get current URL (this will run on client side)
  const getShareUrl = () => {
    if (typeof window === "undefined") return "";
    return window.location.href;
  };

  const getShareText = () =>
    `Check out this ${language} solution for ${title} by ${username}`;

  const handleCopyLink = () => {
    try {
      const url = getShareUrl();
      navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success(t("linkCopied"));

      // Reset copied state after 2 seconds
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy link: ", error);
      toast.error(t("copyLinkError"));
    }
  };

  return (
    <TooltipProvider>
      <DropdownMenu>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Share className="h-4 w-4" />
                <span className="sr-only">{t("share")}</span>
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>{t("share")}</TooltipContent>
        </Tooltip>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                getShareText()
              )}&url=${encodeURIComponent(getShareUrl())}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center">
              <Twitter className="h-4 w-4 mr-2" />
              Twitter
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                getShareUrl()
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center">
              <Facebook className="h-4 w-4 mr-2" />
              Facebook
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                getShareUrl()
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center">
              <Linkedin className="h-4 w-4 mr-2" />
              LinkedIn
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <a
              href={`mailto:?subject=${encodeURIComponent(
                getShareText()
              )}&body=${encodeURIComponent(getShareUrl())}`}
              className="flex items-center">
              <Mail className="h-4 w-4 mr-2" />
              Email
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleCopyLink}
            className="flex items-center">
            {copied ? (
              <Check className="h-4 w-4 mr-2 text-green-500" />
            ) : (
              <Check className="h-4 w-4 mr-2" />
            )}
            {copied ? t("linkCopied") : t("copyLink")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </TooltipProvider>
  );
}
