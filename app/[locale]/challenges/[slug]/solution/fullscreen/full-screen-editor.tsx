"use client";

import { useEffect, useState } from "react";
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
import { SUPPORTED_LANGUAGES, THEME_OPTIONS } from "../solution-editor";
import type { Challenge } from "@/app/actions/challenges";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { submitSolution } from "@/app/actions/challenges";

interface FullScreenEditorProps {
  challenge: Challenge;
  params: {
    slug: string;
    locale: string;
  };
}

export function FullScreenEditor({ challenge, params }: FullScreenEditorProps) {
  const router = useRouter();
  const t = useTranslations("Challenge");
  const { data: session } = useSession();

  // State management
  const [code, setCode] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("python");
  const [selectedTheme, setSelectedTheme] = useState("solarizeddark");
  const [documentation, setDocumentation] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editorOnLeft, setEditorOnLeft] = useState(false);
  const [output, setOutput] = useState("");

  // Load saved state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem("editorState");
    if (savedState) {
      const state = JSON.parse(savedState);
      setCode(state.code);
      setSelectedLanguage(state.selectedLanguage);
      setSelectedTheme(state.selectedTheme);
      setDocumentation(state.documentation);
      setIsPrivate(state.isPrivate);
      localStorage.removeItem("editorState"); // Clear after loading
    }
  }, []);

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
      // Mock API call - replace with your actual endpoint
      const response = await fetch("/api/run-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language: selectedLanguage }),
      });
      const result = await response.json();
      setOutput(result.output || "No output");
    } catch (error) {
      console.error("Error running code:", error);
      setOutput("Error executing code");
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden min-w-[1024px]">
      {/* Editor Controls */}
      <div className="border-b p-4 bg-background flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SUPPORTED_LANGUAGES.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  {t(lang.labelKey)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedTheme} onValueChange={setSelectedTheme}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {THEME_OPTIONS.map((theme) => (
                <SelectItem key={theme.value} value={theme.value}>
                  {t(theme.labelKey)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditorOnLeft(!editorOnLeft)}
            title={t("switchEditorSide")}>
            <SwitchCamera className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={handleRunCode}>
            <Play className="h-4 w-4 mr-2" />
            {t("runCode")}
          </Button>
          <Button
            variant="default"
            onClick={handleSubmit}
            disabled={isSubmitting}>
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
            onClick={() => router.push(`/challenges/${params.slug}`)}>
            <Minimize2 className="h-4 w-4 mr-2" />
            {t("exitFullscreen")}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <PanelGroup direction="horizontal" className="flex-1">
        {editorOnLeft ? (
          <>
            {/* Editor Panel */}
            <Panel defaultSize={60} minSize={30} className="flex flex-col">
              <div className="flex-1">
                <CodeEditor
                  value={code}
                  onChange={(value) => setCode(value || "")}
                  language={selectedLanguage}
                  theme={selectedTheme}
                  height="100%"
                />
              </div>
              {output && (
                <div className="border-t p-2 bg-gray-800 text-white text-sm max-h-40 overflow-auto">
                  <pre>{output}</pre>
                </div>
              )}
            </Panel>
            <PanelResizeHandle className="w-2 bg-gray-300 hover:bg-gray-400 transition-colors" />
            {/* Challenge Panel */}
            <Panel defaultSize={40} minSize={20}>
              <div className="h-full overflow-auto p-4 bg-background">
                <div className="max-w-3xl mx-auto space-y-4">
                  <h1 className="text-2xl font-bold">{challenge.title}</h1>
                  <div className="prose prose-lg dark:prose-invert">
                    <Markdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeHighlight]}>
                      {challenge.content}
                    </Markdown>
                  </div>
                  {challenge.attachments &&
                    challenge.attachments.length > 0 && (
                      <div className="border rounded-lg p-4">
                        <h2 className="text-lg font-semibold mb-4">
                          {t("attachments")}
                        </h2>
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
                                rel="noopener">
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
          </>
        ) : (
          <>
            {/* Challenge Panel */}
            <Panel defaultSize={40} minSize={20}>
              <div className="h-full overflow-auto p-4 bg-background">
                <div className="max-w-3xl mx-auto space-y-4">
                  <h1 className="text-2xl font-bold">{challenge.title}</h1>
                  <div className="prose prose-lg dark:prose-invert">
                    <Markdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeHighlight]}>
                      {challenge.content}
                    </Markdown>
                  </div>
                  {challenge.attachments &&
                    challenge.attachments.length > 0 && (
                      <div className="border rounded-lg p-4">
                        <h2 className="text-lg font-semibold mb-4">
                          {t("attachments")}
                        </h2>
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
                                rel="noopener">
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
            <PanelResizeHandle className="w-2 bg-gray-300 hover:bg-gray-400 transition-colors" />
            {/* Editor Panel */}
            <Panel defaultSize={60} minSize={30} className="flex flex-col">
              <div className="flex-1">
                <CodeEditor
                  value={code}
                  onChange={(value) => setCode(value || "")}
                  language={selectedLanguage}
                  theme={selectedTheme}
                  height="100%"
                />
              </div>
              {output && (
                <div className="border-t p-2 bg-gray-800 text-white text-sm max-h-40 overflow-auto">
                  <pre>{output}</pre>
                </div>
              )}
            </Panel>
          </>
        )}
      </PanelGroup>
    </div>
  );
}
