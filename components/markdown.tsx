"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

interface MarkdownProps {
  content: string;
  className?: string;
}

export function Markdown({ content, className }: MarkdownProps) {
  const t = useTranslations("Common");

  const markdownComponents = {
    code({ className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || "");
      const language = match ? match[1] : "";
      const isInline = !match;

      if (!isInline) {
        return (
          <div className="relative group">
            <div className="flex items-center justify-between bg-muted/80 px-4 py-1.5 rounded-t-lg font-mono text-sm">
              <span>{language}</span>
              <Button
                variant="ghost"
                size="icon"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => {
                  navigator.clipboard.writeText(String(children));
                  toast.success(t("codeCopied"));
                }}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <code
              className={cn("rounded-t-none font-mono text-sm", className)}
              {...props}>
              {children}
            </code>
          </div>
        );
      }

      return (
        <code
          className={cn("rounded-sm px-1.5 py-0.5 font-mono", className)}
          {...props}>
          {children}
        </code>
      );
    },
    p({ children }: any) {
      return <p className="leading-7 [&:not(:first-child)]:mt-6">{children}</p>;
    },
  };

  return (
    <div
      className={cn(
        "prose prose-sm md:prose-base dark:prose-invert max-w-none",
        className
      )}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={markdownComponents}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
