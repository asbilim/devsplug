"use client";

import { useEffect, useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "@/src/i18n/routing";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Loader2,
  Maximize2,
  Play,
  Download,
  ChevronLeft,
  Settings,
  Save,
} from "lucide-react";
import { toast } from "sonner";
import { CodeEditor } from "@/components/code-editor";
import { submitSolution } from "@/app/actions/challenges";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import Link from "next/link";
import type { Challenge } from "@/app/actions/challenges";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useDebounce } from "@/hooks/use-debounce";

// Dynamically import MDEditor to avoid SSR issues
const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default),
  { ssr: false }
);

// Comprehensive language support with grouping
export const SUPPORTED_LANGUAGES = [
  // Popular languages group
  {
    group: "popular",
    languages: [
      { value: "python", labelKey: "language.python" },
      { value: "javascript", labelKey: "language.javascript" },
      { value: "typescript", labelKey: "language.typescript" },
      { value: "java", labelKey: "language.java" },
      { value: "cpp", labelKey: "language.cpp" },
      { value: "csharp", labelKey: "language.csharp" },
      { value: "go", labelKey: "language.go" },
      { value: "rust", labelKey: "language.rust" },
    ],
  },
  // Web development group
  {
    group: "web",
    languages: [
      { value: "html", labelKey: "language.html" },
      { value: "css", labelKey: "language.css" },
      { value: "jsx", labelKey: "language.jsx" },
      { value: "tsx", labelKey: "language.tsx" },
      { value: "php", labelKey: "language.php" },
      { value: "vue", labelKey: "language.vue" },
      { value: "svelte", labelKey: "language.svelte" },
      { value: "angular", labelKey: "language.angular" },
    ],
  },
  // Systems programming group
  {
    group: "systems",
    languages: [
      { value: "c", labelKey: "language.c" },
      { value: "assembly", labelKey: "language.assembly" },
      { value: "fortran", labelKey: "language.fortran" },
      { value: "verilog", labelKey: "language.verilog" },
      { value: "vhdl", labelKey: "language.vhdl" },
    ],
  },
  // Scripting group
  {
    group: "scripting",
    languages: [
      { value: "ruby", labelKey: "language.ruby" },
      { value: "perl", labelKey: "language.perl" },
      { value: "bash", labelKey: "language.bash" },
      { value: "powershell", labelKey: "language.powershell" },
      { value: "lua", labelKey: "language.lua" },
    ],
  },
  // Mobile development group
  {
    group: "mobile",
    languages: [
      { value: "swift", labelKey: "language.swift" },
      { value: "kotlin", labelKey: "language.kotlin" },
      { value: "objectivec", labelKey: "language.objectivec" },
      { value: "dart", labelKey: "language.dart" },
      { value: "flutter", labelKey: "language.flutter" },
    ],
  },
  // Data science group
  {
    group: "data",
    languages: [
      { value: "r", labelKey: "language.r" },
      { value: "julia", labelKey: "language.julia" },
      { value: "matlab", labelKey: "language.matlab" },
      { value: "sql", labelKey: "language.sql" },
      { value: "scala", labelKey: "language.scala" },
    ],
  },
  // Functional languages group
  {
    group: "functional",
    languages: [
      { value: "haskell", labelKey: "language.haskell" },
      { value: "clojure", labelKey: "language.clojure" },
      { value: "elixir", labelKey: "language.elixir" },
      { value: "erlang", labelKey: "language.erlang" },
      { value: "fsharp", labelKey: "language.fsharp" },
      { value: "ocaml", labelKey: "language.ocaml" },
    ],
  },
  // Markup and config group
  {
    group: "markup",
    languages: [
      { value: "xml", labelKey: "language.xml" },
      { value: "json", labelKey: "language.json" },
      { value: "yaml", labelKey: "language.yaml" },
      { value: "toml", labelKey: "language.toml" },
      { value: "markdown", labelKey: "language.markdown" },
      { value: "latex", labelKey: "language.latex" },
    ],
  },
  // Other languages group
  {
    group: "other",
    languages: [
      { value: "cobol", labelKey: "language.cobol" },
      { value: "groovy", labelKey: "language.groovy" },
      { value: "crystal", labelKey: "language.crystal" },
      { value: "nim", labelKey: "language.nim" },
      { value: "prolog", labelKey: "language.prolog" },
      { value: "racket", labelKey: "language.racket" },
      { value: "solidity", labelKey: "language.solidity" },
      { value: "zig", labelKey: "language.zig" },
    ],
  },
] as const;

// Extended theme options
export const THEME_OPTIONS = [
  { value: "default", labelKey: "theme.default" },
  { value: "monokailight", labelKey: "theme.monokailight" },
  { value: "dracula", labelKey: "theme.dracula" },
  { value: "cobalt", labelKey: "theme.cobalt" },
  { value: "eclipse", labelKey: "theme.eclipse" },
  { value: "material", labelKey: "theme.material" },
  { value: "solarizeddark", labelKey: "theme.solarizeddark" },
  { value: "solarizedlight", labelKey: "theme.solarizedlight" },
  { value: "github", labelKey: "theme.github" },
  { value: "vscode", labelKey: "theme.vscode" },
  { value: "nord", labelKey: "theme.nord" },
  { value: "aura", labelKey: "theme.aura" },
  { value: "tokyonight", labelKey: "theme.tokyonight" },
  { value: "palenight", labelKey: "theme.palenight" },
  { value: "oceanic", labelKey: "theme.oceanic" },
] as const;

// Font options for the editor
export const FONT_OPTIONS = [
  { value: "default", labelKey: "font.default" },
  { value: "firaCode", labelKey: "font.firaCode" },
  { value: "jetBrainsMono", labelKey: "font.jetBrainsMono" },
  { value: "sourceCodePro", labelKey: "font.sourceCodePro" },
  { value: "ubuntuMono", labelKey: "font.ubuntuMono" },
  { value: "cascadiaCode", labelKey: "font.cascadiaCode" },
  { value: "hack", labelKey: "font.hack" },
] as const;

interface SolutionEditorProps {
  params: {
    slug: string;
    locale: string;
  };
  challenge: Challenge;
  slug: string;
}

export function SolutionEditor({
  params,
  challenge,
  slug,
}: SolutionEditorProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const t = useTranslations("Challenge");
  const { theme } = useTheme();
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Editor state
  const [selectedLanguage, setSelectedLanguage] = useState<string>("python");
  const [code, setCode] = useState("");
  const [documentation, setDocumentation] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("editor");
  const [selectedTheme, setSelectedTheme] = useState<string>("solarizeddark");
  const [languageSearch, setLanguageSearch] = useState("");
  const debouncedLanguageSearch = useDebounce(languageSearch, 300);

  // Editor preferences
  const [fontSize, setFontSize] = useState(14);
  const [lineHeight, setLineHeight] = useState(1.5);
  const [selectedFont, setSelectedFont] = useState("default");
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [enableLigatures, setEnableLigatures] = useState(true);
  const [tabSize, setTabSize] = useState(2);
  const [wordWrap, setWordWrap] = useState(true);
  const [autoSave, setAutoSave] = useState(true);

  // Auto-save functionality
  useEffect(() => {
    if (!autoSave) return;

    const saveTimer = setTimeout(() => {
      if (code.trim() || documentation.trim()) {
        localStorage.setItem(
          `editorState_${slug}`,
          JSON.stringify({
            code,
            documentation,
            selectedLanguage,
            selectedTheme,
            isPrivate,
            lastSaved: new Date().toISOString(),
          })
        );
      }
    }, 3000);

    return () => clearTimeout(saveTimer);
  }, [
    code,
    documentation,
    selectedLanguage,
    selectedTheme,
    isPrivate,
    slug,
    autoSave,
  ]);

  // Load saved state on mount
  useEffect(() => {
    try {
      const savedState = localStorage.getItem(`editorState_${slug}`);
      if (savedState) {
        const parsed = JSON.parse(savedState);
        setCode(parsed.code || "");
        setDocumentation(parsed.documentation || "");
        setSelectedLanguage(parsed.selectedLanguage || "python");
        setSelectedTheme(parsed.selectedTheme || "solarizeddark");
        setIsPrivate(parsed.isPrivate || false);

        // Show toast for recovered session
        const lastSaved = parsed.lastSaved ? new Date(parsed.lastSaved) : null;
        if (lastSaved) {
          const timeAgo = getTimeAgo(lastSaved);
          toast.info(t("sessionRecovered", { timeAgo }));
        }
      }
    } catch (error) {
      console.error("Error loading saved state:", error);
    }
  }, [slug, t]);

  // Load editor preferences from localStorage
  useEffect(() => {
    try {
      const savedPrefs = localStorage.getItem("editorPreferences");
      if (savedPrefs) {
        const prefs = JSON.parse(savedPrefs);
        setFontSize(prefs.fontSize || 14);
        setLineHeight(prefs.lineHeight || 1.5);
        setSelectedFont(prefs.selectedFont || "default");
        setShowLineNumbers(
          prefs.showLineNumbers !== undefined ? prefs.showLineNumbers : true
        );
        setEnableLigatures(
          prefs.enableLigatures !== undefined ? prefs.enableLigatures : true
        );
        setTabSize(prefs.tabSize || 2);
        setWordWrap(prefs.wordWrap !== undefined ? prefs.wordWrap : true);
        setAutoSave(prefs.autoSave !== undefined ? prefs.autoSave : true);
      }
    } catch (error) {
      console.error("Error loading editor preferences:", error);
    }
  }, []);

  // Save editor preferences
  const saveEditorPreferences = () => {
    localStorage.setItem(
      "editorPreferences",
      JSON.stringify({
        fontSize,
        lineHeight,
        selectedFont,
        showLineNumbers,
        enableLigatures,
        tabSize,
        wordWrap,
        autoSave,
      })
    );
    toast.success(t("preferenceSaved"));
  };

  // Filter languages based on search
  const filteredLanguages = useMemo(() => {
    if (!debouncedLanguageSearch) return SUPPORTED_LANGUAGES;

    const search = debouncedLanguageSearch.toLowerCase();
    return SUPPORTED_LANGUAGES.map((group) => ({
      ...group,
      languages: group.languages.filter(
        (lang) =>
          t(lang.labelKey).toLowerCase().includes(search) ||
          lang.value.toLowerCase().includes(search)
      ),
    })).filter((group) => group.languages.length > 0);
  }, [debouncedLanguageSearch, t]);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(`/auth/login`);
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

      await submitSolution(slug, {
        code,
        documentation,
        language: selectedLanguage,
        is_private: isPrivate,
      });

      toast.success(t("submitSuccess"));

      // Clear saved state after successful submission
      localStorage.removeItem(`editorState_${slug}`);

      router.push(`/challenges/${slug}`);
    } catch (error) {
      toast.error(t("submitError"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleFullScreen = () => {
    // Save current state to localStorage before redirecting
    localStorage.setItem(
      `editorState_${slug}`,
      JSON.stringify({
        code,
        documentation,
        selectedLanguage,
        selectedTheme,
        isPrivate,
        lastSaved: new Date().toISOString(),
      })
    );

    router.push(`/challenges/${slug}/solution/fullscreen`);
  };

  // Helper function to format time ago
  function getTimeAgo(date: Date): string {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return t("timeAgo.justNow");

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60)
      return t("timeAgo.minutes", { minutes: diffInMinutes });

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return t("timeAgo.hours", { hours: diffInHours });

    const diffInDays = Math.floor(diffInHours / 24);
    return t("timeAgo.days", { days: diffInDays });
  }

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b bg-background">
          <div className="flex items-center gap-2 md:gap-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => router.back()}
                    variant="ghost"
                    size="icon"
                    className="md:hidden">
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{t("back")}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Button
              onClick={() => router.back()}
              variant="outline"
              size="sm"
              className="hidden md:flex">
              {t("back")}
            </Button>
            <h1 className="text-lg md:text-xl font-bold truncate">
              {t("submitSolution")}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Settings className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>{t("editorPreferences")}</SheetTitle>
                  <SheetDescription>
                    {t("editorPreferencesDesc")}
                  </SheetDescription>
                </SheetHeader>
                <ScrollArea className="h-[calc(100vh-8rem)] pr-4 mt-6">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label>
                        {t("fontSize")}: {fontSize}px
                      </Label>
                      <Slider
                        value={[fontSize]}
                        min={10}
                        max={24}
                        step={1}
                        onValueChange={(value) => setFontSize(value[0])}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>
                        {t("lineHeight")}: {lineHeight}
                      </Label>
                      <Slider
                        value={[lineHeight * 10]}
                        min={10}
                        max={30}
                        step={1}
                        onValueChange={(value) => setLineHeight(value[0] / 10)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="font">{t("font")}</Label>
                      <Select
                        value={selectedFont}
                        onValueChange={(value) => setSelectedFont(value)}>
                        <SelectTrigger id="font">
                          <SelectValue
                            placeholder={t("selectFontPlaceholder")}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {FONT_OPTIONS.map((font) => (
                            <SelectItem key={font.value} value={font.value}>
                              {t(font.labelKey)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tabSize">{t("tabSize")}</Label>
                      <Select
                        value={tabSize.toString()}
                        onValueChange={(value) => setTabSize(parseInt(value))}>
                        <SelectTrigger id="tabSize">
                          <SelectValue
                            placeholder={t("selectTabSizePlaceholder")}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {[2, 4, 8].map((size) => (
                            <SelectItem key={size} value={size.toString()}>
                              {size} {t("spaces")}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between py-2">
                      <Label htmlFor="showLineNumbers">
                        {t("showLineNumbers")}
                      </Label>
                      <Switch
                        id="showLineNumbers"
                        checked={showLineNumbers}
                        onCheckedChange={setShowLineNumbers}
                      />
                    </div>

                    <div className="flex items-center justify-between py-2">
                      <Label htmlFor="enableLigatures">
                        {t("enableLigatures")}
                      </Label>
                      <Switch
                        id="enableLigatures"
                        checked={enableLigatures}
                        onCheckedChange={setEnableLigatures}
                      />
                    </div>

                    <div className="flex items-center justify-between py-2">
                      <Label htmlFor="wordWrap">{t("wordWrap")}</Label>
                      <Switch
                        id="wordWrap"
                        checked={wordWrap}
                        onCheckedChange={setWordWrap}
                      />
                    </div>

                    <div className="flex items-center justify-between py-2">
                      <Label htmlFor="autoSave">{t("autoSave")}</Label>
                      <Switch
                        id="autoSave"
                        checked={autoSave}
                        onCheckedChange={setAutoSave}
                      />
                    </div>

                    <Button className="w-full" onClick={saveEditorPreferences}>
                      <Save className="h-4 w-4 mr-2" />
                      {t("savePreferences")}
                    </Button>
                  </div>
                </ScrollArea>
              </SheetContent>
            </Sheet>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleFullScreen}
                    className="h-9 w-9">
                    <Maximize2 className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{t("fullscreen")}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 overflow-hidden">
          {/* Left Panel - Challenge Details */}
          <div
            className={cn(
              "border-r overflow-auto h-full",
              isMobile && activeTab !== "details" ? "hidden" : ""
            )}>
            <div className="p-4 md:p-6 space-y-4 md:space-y-6 h-full">
              <Card className="mb-4">
                <CardHeader className="p-4">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Download className="h-5 w-5" />
                    {t("attachments")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-3 p-4">
                  <div className="flex flex-col gap-2">
                    {challenge?.attachments?.length > 0 ? (
                      challenge.attachments.map((attachment) => (
                        <Button
                          key={attachment.id}
                          variant="outline"
                          size="sm"
                          className="justify-start gap-2"
                          asChild>
                          <Link href={attachment.file} target="_blank" download>
                            <Download className="h-4 w-4" />
                            <span className="truncate">{attachment.title}</span>
                          </Link>
                        </Button>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        {t("noAttachments")}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="flex-1">
                <CardHeader className="p-4">
                  <CardTitle className="text-base">{t("stats")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-4">
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
              <div className="border-b px-4 md:px-6">
                <TabsList className="h-12">
                  {isMobile && (
                    <TabsTrigger value="details">{t("details")}</TabsTrigger>
                  )}
                  <TabsTrigger value="editor">{t("code")}</TabsTrigger>
                  <TabsTrigger value="documentation">
                    {t("documentation")}
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent
                value="editor"
                className="flex-1 p-4 md:p-6 space-y-4 overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 flex-wrap">
                  <div className="space-y-2 w-full md:w-auto">
                    <Label htmlFor="language">{t("selectLanguage")}</Label>
                    <div className="relative">
                      <Select
                        value={selectedLanguage}
                        onValueChange={(value) => {
                          setSelectedLanguage(value);
                          // Only reset code if explicitly changing to a different language
                          if (value !== selectedLanguage) {
                            // Ask for confirmation if there's existing code
                            if (code.trim()) {
                              if (window.confirm(t("confirmLanguageChange"))) {
                                setCode("");
                              } else {
                                // Reset the select to previous value
                                return;
                              }
                            } else {
                              setCode("");
                            }
                          }
                        }}>
                        <SelectTrigger
                          id="language"
                          className="w-full md:w-[200px]">
                          <SelectValue
                            placeholder={t("selectLanguagePlaceholder")}
                          />
                        </SelectTrigger>
                        <SelectContent className="max-h-80">
                          <div className="p-2">
                            <Input
                              placeholder={t("searchLanguages")}
                              value={languageSearch}
                              onChange={(e) =>
                                setLanguageSearch(e.target.value)
                              }
                              className="mb-2"
                            />
                          </div>
                          <ScrollArea className="max-h-60">
                            {filteredLanguages.map((group) => (
                              <div key={group.group}>
                                <SelectGroup>
                                  <SelectLabel>
                                    {t(`languageGroup.${group.group}`)}
                                  </SelectLabel>
                                  {group.languages.map((lang) => (
                                    <SelectItem
                                      key={lang.value}
                                      value={lang.value}>
                                      {t(lang.labelKey)}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </div>
                            ))}
                          </ScrollArea>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2 w-full md:w-auto">
                    <Label htmlFor="theme">{t("selectTheme")}</Label>
                    <Select
                      value={selectedTheme}
                      onValueChange={(value) => setSelectedTheme(value)}>
                      <SelectTrigger id="theme" className="w-full md:w-[200px]">
                        <SelectValue
                          placeholder={t("selectThemePlaceholder")}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <ScrollArea className="max-h-60">
                          {THEME_OPTIONS.map((theme) => (
                            <SelectItem key={theme.value} value={theme.value}>
                              {t(theme.labelKey)}
                            </SelectItem>
                          ))}
                        </ScrollArea>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex-1 min-h-[300px] relative">
                  <CodeEditor
                    value={code}
                    onChange={setCode}
                    language={selectedLanguage}
                    theme={selectedTheme}
                    options={{
                      fontSize: fontSize,
                      lineHeight: lineHeight,
                      fontFamily:
                        selectedFont !== "default" ? selectedFont : undefined,
                      lineNumbers: showLineNumbers,
                      fontLigatures: enableLigatures,
                      tabSize: tabSize,
                      wordWrap: wordWrap ? "on" : "off",
                    }}
                  />
                </div>
              </TabsContent>

              <TabsContent
                value="documentation"
                className="flex-1 p-4 md:p-6 space-y-4 h-full overflow-auto">
                <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                  <h3 className="text-lg font-medium">
                    {t("documentationTitle")}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t("documentationDescription")}
                  </p>
                </div>

                <div
                  className="flex-1 min-h-[300px] rounded-md border"
                  data-color-mode={theme === "dark" ? "dark" : "light"}>
                  <MDEditor
                    value={documentation}
                    onChange={setDocumentation}
                    preview="edit"
                    height={500}
                  />
                </div>
              </TabsContent>

              {isMobile && (
                <TabsContent
                  value="details"
                  className="flex-1 p-4 space-y-4 overflow-auto">
                  <Card className="mb-4">
                    <CardHeader className="p-4">
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Download className="h-5 w-5" />
                        {t("attachments")}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-3 p-4">
                      <div className="flex flex-col gap-2">
                        {challenge?.attachments?.length > 0 ? (
                          challenge.attachments.map((attachment) => (
                            <Button
                              key={attachment.id}
                              variant="outline"
                              size="sm"
                              className="justify-start gap-2"
                              asChild>
                              <Link
                                href={attachment.file}
                                target="_blank"
                                download>
                                <Download className="h-4 w-4" />
                                <span className="truncate">
                                  {attachment.title}
                                </span>
                              </Link>
                            </Button>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            {t("noAttachments")}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="p-4">
                      <CardTitle className="text-base">{t("stats")}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 p-4">
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
                </TabsContent>
              )}
            </Tabs>

            {/* Footer Actions */}
            <div className="p-4 md:p-6 border-t">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isPrivate"
                    checked={isPrivate}
                    onCheckedChange={setIsPrivate}
                  />
                  <Label htmlFor="isPrivate">{t("privateSubmission")}</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className="cursor-help">
                        <span className="text-muted-foreground text-sm underline">
                          (?)
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{t("privateSubmissionHelp")}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => router.back()}
                    className="flex-1 md:flex-none">
                    {t("cancel")}
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="flex-1 md:flex-none">
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t("submitting")}
                      </>
                    ) : (
                      <>
                        <Play className="mr-2 h-4 w-4" />
                        {t("submit")}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
