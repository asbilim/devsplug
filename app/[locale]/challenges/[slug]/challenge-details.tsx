"use client";

import {
  Challenge,
  subscribeToChallenge,
  unsubscribeFromChallenge,
  submitSolution,
} from "@/app/actions/challenges";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Clock, Download, Code2, Copy, Loader2 } from "lucide-react";
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
import { CodeEditor } from "@/components/code-editor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import type { Components } from "react-markdown";
import { useParams } from "next/navigation";

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
  const [code, setCode] = useState("");
  const [documentation, setDocumentation] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const params = useParams();

  const handleSubscribe = async () => {
    if (!session) {
      toast.error(t("signInToSubmit"));
      return;
    }

    try {
      setIsSubscribing(true);
      // Get access token from session
      const accessToken = session.backendTokens.accessToken as string;

      console.log("this is the access token: ", session);

      if (challenge.subscription_status?.is_subscribed) {
        await unsubscribeFromChallenge(challenge.slug, accessToken);
        toast.success(t("unsubscribeSuccess"));
      } else {
        await subscribeToChallenge(challenge.slug, accessToken);
        toast.success(t("subscribeSuccess"));
      }
      // Refresh the page to update the challenge status
      window.location.reload();
    } catch (error) {
      toast.error(t("subscribeError"));
    } finally {
      setIsSubscribing(false);
    }
  };

  const handleSubmit = async () => {
    if (!session) {
      toast.error(t("signInToSubmit"));
      return;
    }

    if (!selectedLanguage) {
      toast.error(t("languageRequired"));
      return;
    }

    if (!code.trim()) {
      toast.error(t("codeRequired"));
      return;
    }

    try {
      setIsLoading(true);
      await submitSolution(challenge.slug, {
        code,
        documentation,
        language: selectedLanguage,
        is_private: isPrivate,
      });
      toast.success(t("submitSuccess"));
      // Clear form
      setCode("");
      setDocumentation("");
      setIsPrivate(false);
    } catch (error) {
      toast.error(t("submitError"));
    } finally {
      setIsLoading(false);
    }
  };

  const markdownComponents: Components = {
    code({ className, children, ...props }) {
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
    p({ children }) {
      return <p className="leading-7 [&:not(:first-child)]:mt-6">{children}</p>;
    },
  };

  return (
    <div className="space-y-12 max-w-5xl mx-auto">
      {/* Challenge Header */}
      <div className="space-y-6 bg-card p-8 rounded-lg border shadow-sm">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold font-geist gradient-text">
            {challenge.title}
          </h1>
          <div className="flex items-center gap-4">
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
            {challenge.subscription_status?.is_subscribed ? (
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-base px-4 py-1">
                  {t("subscribed")}
                </Badge>
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={isSubscribing || !session}
                  onClick={handleSubscribe}>
                  {isSubscribing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    t("unsubscribe")
                  )}
                </Button>
              </div>
            ) : (
              <Button
                variant="default"
                size="sm"
                disabled={isSubscribing || !session}
                onClick={handleSubscribe}>
                {isSubscribing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  t("subscribe")
                )}
              </Button>
            )}
          </div>
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
          {challenge.subscription_status?.max_attempts && (
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {t("attemptsRemaining", {
                  current: challenge.subscription_status.attempts_count,
                  max: challenge.subscription_status.max_attempts,
                })}
              </Badge>
            </div>
          )}
        </div>
      </div>

      {/* Attachments Section */}
      {challenge.attachments && challenge.attachments.length > 0 && (
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
              components={markdownComponents}>
              {challenge.content}
            </Markdown>
          </article>
        </CardContent>
      </Card>

      {/* Solution Area */}
      {session ? (
        <Card>
          <CardHeader className="bg-muted/50">
            <div className="flex items-center justify-between">
              <CardTitle>{t("solution")}</CardTitle>
              <Button asChild>
                <Link
                  href={`/${params.locale}/challenges/${challenge.slug}/solution`}>
                  {t("writeSolution")}
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {challenge.subscription_status?.is_subscribed ? (
              <div className="text-center text-muted-foreground">
                {t("clickToWriteSolution")}
              </div>
            ) : (
              <div className="text-center text-muted-foreground">
                {t("subscribeToSubmit")}
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-muted-foreground">
              {t("signInToSubmit")}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
