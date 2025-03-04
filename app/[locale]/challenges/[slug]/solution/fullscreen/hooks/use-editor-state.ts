import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "@/src/i18n/routing";
import { useTranslations } from "next-intl";
import { submitSolution } from "@/app/actions/challenges";
import type { EditorState } from "../types";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "";

export function useEditorState(slug: string) {
  const router = useRouter();
  const t = useTranslations("Challenge");
  const { data: session } = useSession();

  const [code, setCode] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("python");
  const [documentation, setDocumentation] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [output, setOutput] = useState("");

  useEffect(() => {
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
      await submitSolution(slug, {
        code,
        documentation,
        language: selectedLanguage,
        is_private: isPrivate,
      });

      toast.success(t("submitSuccess"));
      router.push(`/challenges/${slug}`);
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

  const saveStateBeforeExit = () => {
    const stateToSave: EditorState = {
      code,
      selectedLanguage,
      documentation,
      isPrivate,
    };
    localStorage.setItem("editorState", JSON.stringify(stateToSave));
    router.back();
  };

  return {
    code,
    setCode,
    selectedLanguage,
    setSelectedLanguage,
    documentation,
    setDocumentation,
    isPrivate,
    setIsPrivate,
    isSubmitting,
    output,
    handleSubmit,
    handleRunCode,
    saveStateBeforeExit,
  };
}
