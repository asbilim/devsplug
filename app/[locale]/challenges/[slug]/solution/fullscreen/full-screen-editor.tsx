"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "@/src/i18n/routing";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { CodeEditor } from "@/components/code-editor";
import { Button } from "@/components/ui/button";
import { Minimize2, Play, Save, Loader2, SwitchCamera } from "lucide-react";
import { toast } from "sonner";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import { SUPPORTED_LANGUAGES } from "../solution-editor";
import type { Challenge } from "@/app/actions/challenges";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import { submitSolution } from "@/app/actions/challenges";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useTheme } from "next-themes"; // Step 1: Import useTheme

interface FullScreenEditorProps {
  challenge: Challenge;
  params: {
    slug: string;
    locale: string;
  };
}

// API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "";
const CHALLENGES_ENDPOINT = `${API_BASE_URL}/challenges/listings/`;

interface ChallengeOption {
  id: string;
  slug: string;
  title: string;
}

export function FullScreenEditor({ challenge, params }: FullScreenEditorProps) {
  const router = useRouter();
  const t = useTranslations("Challenge");
  const { data: session } = useSession();
  const outputRef = useRef<HTMLDivElement>(null);
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Step 2: Use useTheme to get the current application theme
  const { resolvedTheme } = useTheme();

  // Step 3: Compute Monaco theme based on resolvedTheme
  const lightThemes = ["retro", "light"]; // Define known light themes
  const monacoTheme =
    resolvedTheme && lightThemes.includes(resolvedTheme) ? "vs" : "vs-dark";

  // State management (removed selectedTheme)
  const [code, setCode] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("python");
  const [documentation, setDocumentation] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editorOnLeft, setEditorOnLeft] = useState(false);
  const [output, setOutput] = useState("");
  const [direction, setDirection] = useState<"horizontal" | "vertical">(
    "horizontal"
  );
  const [editorHeight, setEditorHeight] = useState("100%");
  const [challenges, setChallenges] = useState<ChallengeOption[]>([]);
  const [isLoadingChallenges, setIsLoadingChallenges] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState(params.slug);

  // Fetch available challenges
  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        setIsLoadingChallenges(true);
        const response = await fetch(CHALLENGES_ENDPOINT);
        if (!response.ok) {
          throw new Error(`Failed to fetch challenges: ${response.status}`);
        }
        const data = await response.json();
        setChallenges(
          data.results.map((item: any) => ({
            id: item.id,
            slug: item.slug,
            title: item.title,
          }))
        );
      } catch (error) {
        console.error("Error fetching challenges:", error);
        toast.error(t("challengeLoadError"));
      } finally {
        setIsLoadingChallenges(false);
      }
    };

    fetchChallenges();
  }, [t]);

  // Set direction based on screen size
  useEffect(() => {
    setDirection(isMobile ? "vertical" : "horizontal");
  }, [isMobile]);

  // Recalculate editor height when window resizes
  useEffect(() => {
    const updateEditorHeight = () => {
      if (editorContainerRef.current) {
        const containerHeight = editorContainerRef.current.clientHeight;
        setEditorHeight(`${containerHeight}px`);
      }
    };

    updateEditorHeight();
    window.addEventListener("resize", updateEditorHeight);
    return () => window.removeEventListener("resize", updateEditorHeight);
  }, []);

  // Handle page elements and load saved state
  useEffect(() => {
    const hidePageElements = () => {
      const header = document.querySelector("header");
      const footer = document.querySelector("footer");
      const navigation = document.querySelector("nav");

      if (header) header.style.display = "none";
      if (footer) footer.style.display = "none";
      if (navigation) navigation.style.display = "none";

      document.body.style.overflow = "hidden";
    };

    const showPageElements = () => {
      const header = document.querySelector("header");
      const footer = document.querySelector("footer");
      const navigation = document.querySelector("nav");

      if (header) header.style.display = "";
      if (footer) footer.style.display = "";
      if (navigation) navigation.style.display = "";

      document.body.style.overflow = "";
    };

    hidePageElements();

    // Load saved state without selectedTheme
    const savedState = localStorage.getItem("editorState");
    if (savedState) {
      try {
        const state = JSON.parse(savedState);
        setCode(state.code || "");
        setSelectedLanguage(state.selectedLanguage || "python");
        setDocumentation(state.documentation || "");
        setIsPrivate(state.isPrivate || false);
        localStorage.removeItem("editorState");
      } catch (e) {
        console.error("Error parsing saved editor state", e);
      }
    }

    return () => showPageElements();
  }, []);

  // Focus on output when it changes
  useEffect(() => {
    if (output && outputRef.current) {
      outputRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [output]);

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
      setIsSubmitting(true);
      const accessToken = session.user.backendTokens?.accessToken;

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
      router.push(`/challenges/${params.slug}`);
    } catch (error) {
      console.error("Error submitting solution:", error);
      toast.error(t("submitError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRunCode = async () => {
    try {
      setOutput("Running code...");
      const response = await fetch(`${API_BASE_URL}/api/run-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            session?.user?.backendTokens?.accessToken || ""
          }`,
        },
        body: JSON.stringify({ code, language: selectedLanguage }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const result = await response.json();
      setOutput(result.output || "No output");
    } catch (error) {
      console.error("Error running code:", error);
      setOutput(
        "Error executing code: " +
          (error instanceof Error ? error.message : String(error))
      );
    }
  };

  // Save state before exit (removed selectedTheme)
  const saveStateBeforeExit = () => {
    const stateToSave = {
      code,
      selectedLanguage,
      documentation,
      isPrivate,
    };
    localStorage.setItem("editorState", JSON.stringify(stateToSave));
    router.back();
  };

  const handleKeyboardPanelResize = (
    direction: "left" | "right" | "up" | "down",
    currentSize: number
  ) => {
    setTimeout(() => {
      if (editorContainerRef.current) {
        const containerHeight = editorContainerRef.current.clientHeight;
        setEditorHeight(`${containerHeight}px`);
      }
    }, 100);
  };

  const handleChallengeChange = (slug: string) => {
    if (slug !== params.slug) {
      setSelectedChallenge(slug);
      const stateToSave = {
        code,
        selectedLanguage,
        documentation,
        isPrivate,
      };
      localStorage.setItem("editorState", JSON.stringify(stateToSave));
      router.push(`/challenges/${slug}/solution/fullscreen`);
    }
  };

  const renderEditorPanel = () => (
    <Panel
      defaultSize={50}
      minSize={25}
      className="flex flex-col"
      id="editor-panel">
      <div className="flex-1 overflow-hidden relative" ref={editorContainerRef}>
        <div className="sr-only" id="editor-description">
          {t("codeEditorDescription", { language: selectedLanguage })}
        </div>
        <CodeEditor
          value={code}
          onChange={(value) => setCode(value || "")}
          language={selectedLanguage}
          options={{
            theme: monacoTheme, // Step 4: Use monacoTheme instead of selectedTheme
            minimap: { enabled: true },
            fontSize: 14,
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            automaticLayout: true,
            wordWrap: "on",
            syntaxHighlighting: true,
          }}
          height={editorHeight}
          aria-labelledby="editor-description"
          className="w-full h-full"
          onFocus={() => {
            if (editorContainerRef.current) {
              const containerHeight = editorContainerRef.current.clientHeight;
              setEditorHeight(`${containerHeight}px`);
            }
          }}
        />
      </div>
      {output && (
        <div
          ref={outputRef}
          className="border-t p-2 bg-gray-800 text-white text-sm max-h-40 overflow-auto"
          aria-live="polite"
          aria-label={t("codeOutput")}>
          <pre tabIndex={0}>{output}</pre>
        </div>
      )}
    </Panel>
  );

  const renderChallengePanel = () => (
    <Panel defaultSize={50} minSize={25} id="challenge-panel">
      <div className="h-full overflow-auto p-4">
        <div className="max-w-full mx-auto space-y-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">{challenge.title}</h1>
          </div>
          <div className="prose prose-lg dark:prose-invert max-w-full">
            <Markdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}>
              {challenge.content}
            </Markdown>
          </div>
          {challenge.attachments && challenge.attachments.length > 0 && (
            <div className="border rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-4">{t("attachments")}</h2>
              <div className="space-y-2">
                {challenge.attachments.map((attachment) => (
                  <Button
                    key={attachment.id}
                    variant="outline"
                    className="w-full justify-start"
                    asChild>
                    <a
                      href={attachment.file}
                      target="_blank"
                      rel="noopener"
                      aria-label={`${t("openAttachment")}: ${
                        attachment.title
                      }`}>
                      {attachment.title}
                    </a>
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Panel>
  );

  const renderPanelResizeHandle = () => (
    <PanelResizeHandle
      className={
        direction === "horizontal"
          ? "w-1 bg-gray-300 hover:bg-gray-400 transition-colors focus-visible:outline-blue-500 focus-visible:outline-2 focus-visible:outline"
          : "h-1 bg-gray-300 hover:bg-gray-400 transition-colors focus-visible:outline-blue-500 focus-visible:outline-2 focus-visible:outline"
      }
      tabIndex={0}
      aria-label={t("resizeHandle")}
      onKeyDown={(e) => {
        const step = 5;
        if (direction === "horizontal") {
          if (e.key === "ArrowLeft") {
            e.preventDefault();
            handleKeyboardPanelResize("left", 0);
          } else if (e.key === "ArrowRight") {
            e.preventDefault();
            handleKeyboardPanelResize("right", 0);
          }
        } else {
          if (e.key === "ArrowUp") {
            e.preventDefault();
            handleKeyboardPanelResize("up", 0);
          } else if (e.key === "ArrowDown") {
            e.preventDefault();
            handleKeyboardPanelResize("down", 0);
          }
        }
      }}
      onDragEnd={() => {
        setTimeout(() => {
          if (editorContainerRef.current) {
            const containerHeight = editorContainerRef.current.clientHeight;
            setEditorHeight(`${containerHeight}px`);
          }
        }, 100);
      }}
    />
  );

  return (
    <div className="fixed inset-0 z-50 w-full h-full flex flex-col overflow-hidden bg-background">
      {/* Editor Controls */}
      <div className="border-b p-2 bg-background flex flex-col sm:flex-row items-start sm:items-center justify-between shrink-0 gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Language Selection Dropdown */}
          <Select
            value={selectedLanguage}
            onValueChange={setSelectedLanguage}
            aria-label={t("selectLanguage")}>
            <SelectTrigger className="w-[140px] sm:w-[180px]">
              <SelectValue placeholder={t("selectLanguage")} />
            </SelectTrigger>
            <SelectContent>
              {SUPPORTED_LANGUAGES.map((group) => (
                <SelectGroup key={group.group}>
                  <SelectLabel>{t(`languageGroup.${group.group}`)}</SelectLabel>
                  {group.languages.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {t(lang.labelKey)}
                    </SelectItem>
                  ))}
                </SelectGroup>
              ))}
            </SelectContent>
          </Select>

          {/* Challenge Selection Dropdown */}
          <Select
            value={selectedChallenge}
            onValueChange={handleChallengeChange}
            disabled={isLoadingChallenges}
            aria-label={t("selectChallenge")}>
            <SelectTrigger className="w-[140px] sm:w-[180px]">
              <SelectValue placeholder={t("selectChallenge")} />
            </SelectTrigger>
            <SelectContent>
              {challenges.map((challengeOption) => (
                <SelectItem
                  key={challengeOption.id}
                  value={challengeOption.slug}>
                  {challengeOption.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Step 5: Removed Theme Selection Dropdown */}

          {!isMobile && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditorOnLeft(!editorOnLeft)}
              aria-label={t("switchEditorSide")}>
              <SwitchCamera className="h-4 w-4" />
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
          <Button
            variant="secondary"
            onClick={handleRunCode}
            size="sm"
            aria-label={t("runCode")}
            className="flex-1 sm:flex-none">
            <Play className="h-4 w-4 mr-2" />
            {t("runCode")}
          </Button>
          <Button
            variant="default"
            onClick={handleSubmit}
            disabled={isSubmitting}
            size="sm"
            aria-label={isSubmitting ? t("submitting") : t("submitSolution")}
            className="flex-1 sm:flex-none">
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {t("submitSolution")}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={saveStateBeforeExit}
            aria-label={t("exitFullscreen")}
            className="flex-1 sm:flex-none">
            <Minimize2 className="h-4 w-4 mr-2" />
            {t("exitFullscreen")}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div
        className="flex-1 overflow-hidden"
        role="region"
        aria-label={t("codeEnvironment")}>
        <PanelGroup
          direction={direction}
          className="h-full"
          onLayout={() => {
            setTimeout(() => {
              if (editorContainerRef.current) {
                const containerHeight = editorContainerRef.current.clientHeight;
                setEditorHeight(`${containerHeight}px`);
              }
            }, 100);
          }}>
          {direction === "horizontal" ? (
            editorOnLeft ? (
              <>
                {renderEditorPanel()}
                {renderPanelResizeHandle()}
                {renderChallengePanel()}
              </>
            ) : (
              <>
                {renderChallengePanel()}
                {renderPanelResizeHandle()}
                {renderEditorPanel()}
              </>
            )
          ) : (
            <>
              {renderChallengePanel()}
              {renderPanelResizeHandle()}
              {renderEditorPanel()}
            </>
          )}
        </PanelGroup>
      </div>
    </div>
  );
}
