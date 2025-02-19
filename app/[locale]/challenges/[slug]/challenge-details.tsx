"use client";

import { Challenge } from "@/app/actions/challenges";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Clock, Download, Code2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface ChallengeDetailsProps {
  challenge: Challenge;
}

const SUPPORTED_LANGUAGES = [
  { value: "python", label: "Python" },
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
  { value: "csharp", label: "C#" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
] as const;

export function ChallengeDetails({ challenge }: ChallengeDetailsProps) {
  const { data: session, status } = useSession();
  const t = useTranslations("Challenge");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");

  return (
    <div className="space-y-12 max-w-5xl mx-auto">
      {/* Challenge Header */}
      <div className="space-y-6 bg-card p-8 rounded-lg border shadow-sm">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold font-geist gradient-text">
            {challenge.title}
          </h1>
          <Badge
            variant={
              challenge.difficulty === "easy"
                ? "default"
                : challenge.difficulty === "medium"
                ? "secondary"
                : "destructive"
            }
            className="text-base px-4 py-1">
            {t(`difficulty.${challenge.difficulty}`)}
          </Badge>
        </div>

        <div className="flex items-center gap-6 text-muted-foreground">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            <span>
              {challenge.points} {t("points")}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            <span>
              {challenge.estimated_time} {t("estimatedTime")}
            </span>
          </div>
        </div>
      </div>

      {/* Attachments Section */}
      {challenge.attachments?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              {t("attachments")}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            {challenge.attachments.map((attachment) => (
              <Button
                key={attachment.id}
                asChild
                variant="outline"
                className="justify-start gap-2">
                <Link href={attachment.file} target="_blank" download>
                  <Code2 className="h-4 w-4" />
                  {attachment.title}
                </Link>
              </Button>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Challenge Content */}
      <Card className="overflow-hidden">
        <CardHeader className="bg-muted/50">
          <CardTitle className="font-geist">{t("description")}</CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <article className="prose prose-lg dark:prose-invert max-w-none space-y-6 font-geist">
            <Markdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");
                  const language = match ? match[1] : "";

                  if (!inline && match) {
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
                              toast.success("Code copied to clipboard");
                            }}>
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                        <code
                          className={cn(
                            "rounded-t-none font-mono text-sm",
                            className
                          )}
                          {...props}>
                          {children}
                        </code>
                      </div>
                    );
                  }

                  return (
                    <code
                      className={cn(
                        "rounded-sm px-1.5 py-0.5 font-mono",
                        className
                      )}
                      {...props}>
                      {children}
                    </code>
                  );
                },
                p({ children }) {
                  return (
                    <p className="leading-7 [&:not(:first-child)]:mt-6">
                      {children}
                    </p>
                  );
                },
              }}>
              {challenge.content}
            </Markdown>
          </article>
        </CardContent>
      </Card>

      {/* Submission Area */}
      <Card>
        <CardHeader className="bg-muted/50">
          <CardTitle>{t("yourSolution")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          {status === "loading" ? (
            <Skeleton className="h-[200px] w-full" />
          ) : session ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="language">{t("selectLanguage")}</Label>
                <Select
                  value={selectedLanguage}
                  onValueChange={setSelectedLanguage}>
                  <SelectTrigger id="language" className="w-[200px]">
                    <SelectValue placeholder={t("selectLanguagePlaceholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    {SUPPORTED_LANGUAGES.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value}>
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <textarea
                className="w-full h-[400px] p-4 rounded-lg border bg-card font-mono text-sm resize-y min-h-[200px]"
                placeholder={t("codePlaceholder")}
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline">{t("preview")}</Button>
                <Button disabled={!selectedLanguage} className="px-6">
                  {t("submitSolution")}
                </Button>
              </div>
            </>
          ) : (
            <div className="p-6 text-center text-muted-foreground">
              {t("signInToSubmit")}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
