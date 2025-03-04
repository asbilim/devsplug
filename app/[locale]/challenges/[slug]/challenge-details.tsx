"use client";

import {
  Challenge,
  subscribeToChallenge,
  unsubscribeFromChallenge,
  submitSolution,
  checkChallengeSubscription,
  checkChallengeRegistration,
  registerForChallenge,
  unregisterFromChallenge,
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
import { useState, useEffect } from "react";
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
  const { data: session, status: sessionStatus } = useSession();
  const t = useTranslations("Challenge");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");
  const [code, setCode] = useState("");
  const [documentation, setDocumentation] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isCheckingSubscription, setIsCheckingSubscription] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState({
    is_subscribed: challenge.subscription_status?.is_subscribed || false,
    authenticated: !!session,
    message: "",
  });
  const [isRegistering, setIsRegistering] = useState(false);
  const [isCheckingRegistration, setIsCheckingRegistration] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState({
    is_registered: false,
    authenticated: !!session,
  });
  const params = useParams();

  // Check subscription status when component mounts or session changes
  useEffect(() => {
    const checkSubscription = async () => {
      if (session && session.backendTokens.accessToken) {
        setIsCheckingSubscription(true);
        try {
          const result = await checkChallengeSubscription(
            challenge.slug,
            session.backendTokens.accessToken as string
          );
          setSubscriptionStatus(result);
        } catch (error) {
          console.error("Error checking subscription:", error);
        } finally {
          setIsCheckingSubscription(false);
        }
      }
    };

    if (sessionStatus !== "loading") {
      checkSubscription();
    }
  }, [session, sessionStatus, challenge.slug]);

  // Check registration status when component mounts or session changes
  useEffect(() => {
    const checkRegistration = async () => {
      if (session && session.backendTokens.accessToken) {
        setIsCheckingRegistration(true);
        try {
          const result = await checkChallengeRegistration(
            challenge.slug,
            session.backendTokens.accessToken as string
          );
          setRegistrationStatus(result);
        } catch (error) {
          console.error("Error checking registration:", error);
          // Reset registration status on error to prevent UI inconsistency
          setRegistrationStatus({
            is_registered: false,
            authenticated: !!session,
          });
        } finally {
          setIsCheckingRegistration(false);
        }
      }
    };

    if (sessionStatus !== "loading") {
      checkRegistration();
    }
  }, [session, sessionStatus, challenge.slug]);

  const handleSubscribe = async () => {
    if (!session) {
      toast.error(t("signInToSubmit"));
      return;
    }

    try {
      setIsSubscribing(true);
      // Get access token from session
      const accessToken = session.backendTokens.accessToken as string;

      if (subscriptionStatus.is_subscribed) {
        await unsubscribeFromChallenge(challenge.slug, accessToken);
        toast.success(t("unsubscribeSuccess"));
        setSubscriptionStatus({
          ...subscriptionStatus,
          is_subscribed: false,
        });
      } else {
        await subscribeToChallenge(challenge.slug, accessToken);
        toast.success(t("subscribeSuccess"));
        setSubscriptionStatus({
          ...subscriptionStatus,
          is_subscribed: true,
        });
      }
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

  const handleRegister = async () => {
    if (!session) {
      toast.error(t("signInToSubmit"));
      return;
    }

    try {
      setIsRegistering(true);
      // Get access token from session
      const accessToken = session.backendTokens.accessToken as string;

      if (registrationStatus.is_registered) {
        await unregisterFromChallenge(challenge.slug, accessToken);
        toast.success(t("unregisterSuccess"));
        setRegistrationStatus({
          ...registrationStatus,
          is_registered: false,
        });
      } else {
        await registerForChallenge(challenge.slug, accessToken);
        toast.success(t("registerSuccess"));
        setRegistrationStatus({
          ...registrationStatus,
          is_registered: true,
        });
      }
    } catch (error) {
      toast.error(t("registerError"));
    } finally {
      setIsRegistering(false);
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
    <div className="space-y-6 md:space-y-12 max-w-5xl mx-auto px-4 md:px-0">
      {/* Challenge Header - Improved for mobile */}
      <div className="space-y-6 bg-card p-4 md:p-8 rounded-lg border shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl md:text-4xl font-bold font-geist gradient-text">
            {challenge.title}
          </h1>
          <div className="flex flex-wrap items-center gap-2 md:gap-4">
            <Badge
              variant={
                challenge.difficulty === "easy"
                  ? "default"
                  : challenge.difficulty === "medium"
                  ? "secondary"
                  : "destructive"
              }
              className="text-sm md:text-base px-2 md:px-4 py-0.5 md:py-1">
              {t(`difficulty_${challenge.difficulty}`)}
            </Badge>

            {/* Subscription Status with Loading State */}
            {isCheckingSubscription ? (
              <Button
                variant="outline"
                size="sm"
                disabled
                className="text-xs md:text-sm">
                <Loader2 className="h-3 w-3 md:h-4 md:w-4 animate-spin mr-2" />
                {t("checkingStatus")}
              </Button>
            ) : subscriptionStatus.is_subscribed ? (
              <div className="flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className="text-sm md:text-base px-2 md:px-4 py-0.5 md:py-1">
                  {t("subscribed")}
                </Badge>
                <Button
                  variant="destructive"
                  size="sm"
                  className="text-xs md:text-sm"
                  disabled={isSubscribing || !session}
                  onClick={handleSubscribe}>
                  {isSubscribing ? (
                    <Loader2 className="h-3 w-3 md:h-4 md:w-4 animate-spin" />
                  ) : (
                    t("unsubscribe")
                  )}
                </Button>
              </div>
            ) : (
              <Button
                variant="default"
                size="sm"
                className="text-xs md:text-sm w-full sm:w-auto"
                disabled={isSubscribing || !session}
                onClick={handleSubscribe}>
                {isSubscribing ? (
                  <Loader2 className="h-3 w-3 md:h-4 md:w-4 animate-spin" />
                ) : (
                  t("subscribe")
                )}
              </Button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 md:gap-6 text-sm md:text-base text-muted-foreground">
          <div className="flex items-center gap-1 md:gap-2">
            <Trophy className="h-4 w-4 md:h-5 md:w-5" />
            <span>
              {challenge.points} {t("points")}
            </span>
          </div>
          <div className="flex items-center gap-1 md:gap-2">
            <Clock className="h-4 w-4 md:h-5 md:w-5" />
            <span>
              {challenge.estimated_time} {t("estimatedTime")}
            </span>
          </div>
          {challenge.subscription_status?.max_attempts && (
            <div className="flex items-center gap-1 md:gap-2 mt-1 sm:mt-0">
              <Badge variant="outline" className="text-xs md:text-sm">
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
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="flex items-center gap-2 text-xl md:text-2xl">
              <Download className="h-4 w-4 md:h-5 md:w-5" />
              {t("attachments")}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2 p-4 md:p-6">
            {challenge.attachments.map((attachment) => (
              <Button
                key={attachment.id}
                asChild
                variant="outline"
                className="justify-start gap-2 text-sm md:text-base overflow-hidden text-ellipsis">
                <Link href={attachment.file} target="_blank" download>
                  <Code2 className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
                  <span className="truncate">{attachment.title}</span>
                </Link>
              </Button>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Challenge Content */}
      <Card className="overflow-hidden">
        <CardHeader className="bg-muted/50 p-4 md:p-6">
          <CardTitle className="font-geist text-xl md:text-2xl">
            {t("description")}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-8">
          <article className="prose prose-sm md:prose-lg dark:prose-invert max-w-none space-y-4 md:space-y-6 font-geist">
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
          <CardHeader className="bg-muted/50 p-4 md:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <CardTitle className="text-xl md:text-2xl">
                {t("solution")}
              </CardTitle>
              <div className="flex flex-col sm:flex-row items-center gap-2">
                {registrationStatus.is_registered ? (
                  <>
                    <Button
                      asChild
                      className="w-full sm:w-auto"
                      disabled={isCheckingRegistration}>
                      <Link
                        href={`/${params.locale}/challenges/${challenge.slug}/solution`}>
                        {t("writeSolution")}
                      </Link>
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="default"
                    className="w-full sm:w-auto"
                    disabled={
                      isRegistering || !subscriptionStatus.is_subscribed
                    }
                    onClick={handleRegister}>
                    {isRegistering ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : null}
                    {t("register")}
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            {isCheckingRegistration ? (
              <div className="text-center text-muted-foreground text-sm md:text-base flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                {t("checkingStatus")}
              </div>
            ) : registrationStatus.is_registered ? (
              <div className="text-center text-muted-foreground text-sm md:text-base">
                <div className="flex items-center justify-center gap-2 mb-2"></div>
                {t("clickToWriteSolution")}
              </div>
            ) : subscriptionStatus.is_subscribed ? (
              <div className="text-center text-muted-foreground text-sm md:text-base">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Badge
                    variant="outline"
                    className="bg-yellow-100 dark:bg-yellow-900">
                    {t("subscribed")}
                  </Badge>
                </div>
                {t("registerToSubmit")}
              </div>
            ) : (
              <div className="text-center text-muted-foreground text-sm md:text-base">
                {t("subscribeFirstToRegister")}
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="text-center text-muted-foreground text-sm md:text-base">
              {t("signInToSubmit")}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
