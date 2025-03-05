"use client";

import { cn } from "@/lib/utils";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useState, useEffect, useRef } from "react";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";

interface CodeBlockProps {
  code: string;
  language: string;
  showLineNumbers?: boolean;
}

export function CodeBlock({
  code,
  language,
  showLineNumbers = true,
}: CodeBlockProps) {
  const t = useTranslations("Common");
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (codeRef.current) {
      hljs.highlightElement(codeRef.current);
    }
  }, [code, language, mounted]);

  if (!mounted) {
    return <div className="h-32 w-full bg-muted rounded-md animate-pulse" />;
  }

  // Map language aliases to hljs supported languages
  const normalizedLanguage = (() => {
    const langMap: Record<string, string> = {
      js: "javascript",
      ts: "typescript",
      py: "python",
      "c#": "csharp",
    };

    const normalizedLang = language.toLowerCase();
    return langMap[normalizedLang] || normalizedLang;
  })();

  // Split code into lines for line numbering
  const codeLines = code.split("\n");

  return (
    <div className="relative group overflow-hidden rounded-lg border">
      <div className="flex items-center justify-between bg-muted/50 px-4 py-1.5 font-mono text-sm">
        <span className="text-muted-foreground">{language}</span>
        <Button
          variant="ghost"
          size="icon"
          className="opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => {
            navigator.clipboard.writeText(code);
            toast.success(t("codeCopied"));
          }}>
          <Copy className="h-4 w-4" />
        </Button>
      </div>

      <div className="overflow-x-auto bg-muted/20">
        {showLineNumbers ? (
          <div className="flex">
            <div className="text-right pr-4 py-3 select-none">
              {codeLines.map((_, i) => (
                <div
                  key={i}
                  className="text-xs text-muted-foreground opacity-50">
                  {i + 1}
                </div>
              ))}
            </div>
            <pre className="py-3 flex-1 overflow-x-auto">
              <code
                ref={codeRef}
                className={`language-${normalizedLanguage} text-sm`}>
                {code}
              </code>
            </pre>
          </div>
        ) : (
          <pre className="p-3 overflow-x-auto">
            <code
              ref={codeRef}
              className={`language-${normalizedLanguage} text-sm`}>
              {code}
            </code>
          </pre>
        )}
      </div>
    </div>
  );
}
