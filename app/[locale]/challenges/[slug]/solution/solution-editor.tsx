"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader2, Maximize2, Play, Download } from "lucide-react";
import { toast } from "sonner";
import { CodeEditor } from "@/components/code-editor";
import { submitSolution } from "@/app/actions/challenges";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import type { Challenge } from "@/app/actions/challenges";

// Dynamically import MDEditor to avoid SSR issues
const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default),
  { ssr: false }
);

// Language options with translation keys
const SUPPORTED_LANGUAGES = [
  { value: "python", labelKey: "language.python" },
  { value: "javascript", labelKey: "language.javascript" },
  { value: "typescript", labelKey: "language.typescript" },
  { value: "java", labelKey: "language.java" },
  { value: "cpp", labelKey: "language.cpp" },
  { value: "c", labelKey: "language.c" },
  { value: "csharp", labelKey: "language.csharp" },
  { value: "go", labelKey: "language.go" },
  { value: "rust", labelKey: "language.rust" },
  { value: "ruby", labelKey: "language.ruby" },
  { value: "php", labelKey: "language.php" },
  { value: "swift", labelKey: "language.swift" },
  { value: "kotlin", labelKey: "language.kotlin" },
  { value: "scala", labelKey: "language.scala" },
  { value: "r", labelKey: "language.r" },
  { value: "dart", labelKey: "language.dart" },
  { value: "haskell", labelKey: "language.haskell" },
  { value: "lua", labelKey: "language.lua" },
  { value: "perl", labelKey: "language.perl" },
  { value: "sql", labelKey: "language.sql" },
  { value: "shell", labelKey: "language.shell" },
] as const;

// Theme options with translation keys
const THEME_OPTIONS = [
  { value: "default", labelKey: "theme.default" },
  { value: "monokailight", labelKey: "theme.monokailight" },
  { value: "dracula", labelKey: "theme.dracula" },
  { value: "cobalt", labelKey: "theme.cobalt" },
  { value: "eclipse", labelKey: "theme.eclipse" },
  { value: "material", labelKey: "theme.material" },
  { value: "solarizeddark", labelKey: "theme.solarizeddark" },
  { value: "solarizedlight", labelKey: "theme.solarizedlight" },
] as const;

interface SolutionEditorProps {
  params: {
    slug: string;
    locale: string;
  };
  challenge: Challenge;
}

export function SolutionEditor({ params, challenge }: SolutionEditorProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const t = useTranslations("Challenge");
  const { theme } = useTheme();

  const [selectedLanguage, setSelectedLanguage] = useState<string>("python"); // Default to Python
  const [code, setCode] = useState("");
  const [documentation, setDocumentation] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("editor");
  const [selectedTheme, setSelectedTheme] = useState<string>("solarizeddark"); // Default to Solarized Dark

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(`/${params.locale}/auth/login`);
    }
  }, [status, router, params.locale]);

  const handleSubmit = async () => {
    if (!session?.user) {
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
      const accessToken = (session.user as any).backendTokens?.access_token;

      if (!accessToken) {
        toast.error(t("authenticationError"));
        return;
      }

      await submitSolution(params.slug, {
        code,
        documentation,
        language: selectedLanguage,
        is_private: isPrivate,
      });

      toast.success(t("submitSuccess"));
      router.push(`/${params.locale}/challenges/${params.slug}`);
    } catch (error) {
      toast.error(t("submitError"));
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {!isFullScreen ? (
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b bg-background">
            <div className="flex items-center gap-4">
              <Button onClick={() => router.back()} variant="outline" size="sm">
                {t("back")}
              </Button>
              <h1 className="text-xl font-bold">{t("submitSolution")}</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFullScreen(true)}>
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 overflow-hidden">
            {/* Left Panel - Challenge Details */}
            <div className="border-r overflow-auto h-full">
              <div className="p-6 space-y-6 h-full">
                <Card className="mb-4">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Download className="h-5 w-5" />
                      {t("attachments")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-4">
                    <div className="flex flex-col gap-2">
                      {challenge?.attachments?.map((attachment) => (
                        <Button
                          key={attachment.id}
                          variant="outline"
                          size="sm"
                          className="justify-start gap-2"
                          asChild>
                          <Link href={attachment.file} target="_blank" download>
                            <Download className="h-4 w-4" />
                            {attachment.title}
                          </Link>
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="flex-1">
                  <CardHeader>
                    <CardTitle>{t("stats")}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">
                          {t("difficulty")}
                        </p>
                        <Badge
                          variant={
                            challenge?.difficulty === "easy"
                              ? "default"
                              : challenge?.difficulty === "medium"
                              ? "secondary"
                              : "destructive"
                          }>
                          {t(`difficulty_${challenge?.difficulty || "easy"}`)}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">
                          {t("points")}
                        </p>
                        <p className="font-medium">{challenge?.points} XP</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">
                          {t("estimatedTime")}
                        </p>
                        <p className="font-medium">
                          {challenge?.estimated_time} {t("timeUnit.minutes")}
                        </p>
                      </div>
                      {challenge?.subscription_status?.max_attempts && (
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">
                            {t("attempts")}
                          </p>
                          <Badge variant="outline">
                            {t("attemptsRemaining", {
                              current:
                                challenge.subscription_status.attempts_count,
                              max: challenge.subscription_status.max_attempts,
                            })}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Right Panel - Code Editor */}
            <div className="flex flex-col h-full">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="flex-1">
                <div className="border-b px-6">
                  <TabsList className="h-12">
                    <TabsTrigger value="editor">{t("code")}</TabsTrigger>
                    <TabsTrigger value="documentation">
                      {t("documentation")}
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent
                  value="editor"
                  className="flex-1 p-6 space-y-4 overflow-hidden">
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="space-y-2 w-full md:w-auto">
                      <Label htmlFor="language">{t("selectLanguage")}</Label>
                      <Select
                        value={selectedLanguage}
                        onValueChange={(value) => {
                          setSelectedLanguage(value);
                          // Reset code if language changes to avoid mode mismatch
                          setCode("");
                        }}>
                        <SelectTrigger id="language" className="w-[200px]">
                          <SelectValue
                            placeholder={t("selectLanguagePlaceholder")}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {SUPPORTED_LANGUAGES.map((lang) => (
                            <SelectItem key={lang.value} value={lang.value}>
                              {t(lang.labelKey)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 w-full md:w-auto">
                      <Label htmlFor="theme">{t("selectTheme")}</Label>
                      <Select
                        value={selectedTheme}
                        onValueChange={(value) => setSelectedTheme(value)}>
                        <SelectTrigger id="theme" className="w-[200px]">
                          <SelectValue
                            placeholder={t("selectThemePlaceholder")}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {THEME_OPTIONS.map((theme) => (
                            <SelectItem key={theme.value} value={theme.value}>
                              {t(theme.labelKey)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="secondary" disabled>
                        <Play className="h-4 w-4 mr-2" />
                        {t("runCode")}
                      </Button>
                    </div>
                  </div>

                  <div className="flex-1 border rounded-lg overflow-hidden">
                    <CodeEditor
                      value={code}
                      onChange={(value) => setCode(value || "")}
                      language={selectedLanguage || "plaintext"}
                      theme={selectedTheme}
                      height="calc(100vh - 16rem)"
                    />
                  </div>
                </TabsContent>

                <TabsContent
                  value="documentation"
                  className="flex-1 p-6 overflow-hidden">
                  <div data-color-mode={theme}>
                    <MDEditor
                      value={documentation}
                      onChange={(value) => setDocumentation(value || "")}
                      preview="live"
                      height="calc(100vh - 12rem)"
                      hideToolbar={false}
                      enableScroll={true}
                      textareaProps={{
                        placeholder: t("documentationPlaceholder"),
                      }}
                    />
                  </div>
                </TabsContent>
              </Tabs>

              {/* Footer */}
              <div className="border-t p-6">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="private"
                      checked={isPrivate}
                      onCheckedChange={setIsPrivate}
                    />
                    <Label htmlFor="private">{t("privateSolution")}</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      onClick={() => router.back()}
                      size="lg">
                      {t("viewChallenge")}
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      disabled={isLoading || !selectedLanguage || !code.trim()}
                      size="lg">
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : null}
                      {t("submitSolution")}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Full-Screen Editor Overlay
        <div className="fixed inset-0 bg-background z-50 flex flex-col">
          <div className="flex items-center justify-between p-6 border-b bg-background">
            <h1 className="text-xl font-bold">{t("submitSolution")}</h1>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFullScreen(false)}>
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex-1 p-6 overflow-auto">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="h-full">
              <div className="border-b px-6">
                <TabsList className="h-12">
                  <TabsTrigger value="editor">{t("code")}</TabsTrigger>
                  <TabsTrigger value="documentation">
                    {t("documentation")}
                  </TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="editor" className="h-full overflow-hidden">
                <div className="h-full space-y-4">
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="space-y-2 w-full md:w-auto">
                      <Label htmlFor="language">{t("selectLanguage")}</Label>
                      <Select
                        value={selectedLanguage}
                        onValueChange={(value) => {
                          setSelectedLanguage(value);
                          setCode(""); // Reset code on language change
                        }}>
                        <SelectTrigger id="language" className="w-[200px]">
                          <SelectValue
                            placeholder={t("selectLanguagePlaceholder")}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {SUPPORTED_LANGUAGES.map((lang) => (
                            <SelectItem key={lang.value} value={lang.value}>
                              {t(lang.labelKey)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 w-full md:w-auto">
                      <Label htmlFor="theme">{t("selectTheme")}</Label>
                      <Select
                        value={selectedTheme}
                        onValueChange={(value) => setSelectedTheme(value)}>
                        <SelectTrigger id="theme" className="w-[200px]">
                          <SelectValue
                            placeholder={t("selectThemePlaceholder")}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {THEME_OPTIONS.map((theme) => (
                            <SelectItem key={theme.value} value={theme.value}>
                              {t(theme.labelKey)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="secondary" disabled>
                        <Play className="h-4 w-4 mr-2" />
                        {t("runCode")}
                      </Button>
                    </div>
                  </div>
                  <div className="h-[calc(100vh-12rem)] border rounded-lg overflow-hidden">
                    <CodeEditor
                      value={code}
                      onChange={(value) => setCode(value || "")}
                      language={selectedLanguage || "plaintext"}
                      theme={selectedTheme}
                      height="100%"
                    />
                  </div>
                </div>
              </TabsContent>
              <TabsContent
                value="documentation"
                className="h-full overflow-hidden">
                <div data-color-mode={theme} className="h-full">
                  <MDEditor
                    value={documentation}
                    onChange={(value) => setDocumentation(value || "")}
                    preview="live"
                    height="100%"
                    hideToolbar={false}
                    enableScroll={true}
                    textareaProps={{
                      placeholder: t("documentationPlaceholder"),
                    }}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}
    </div>
  );
}
