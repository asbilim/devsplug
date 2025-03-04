"use client";

import { useTheme } from "next-themes";
import Editor, { BeforeMount, OnMount } from "@monaco-editor/react";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState, useCallback } from "react";

interface CodeEditorProps {
  value: string;
  onChange: (value: string | undefined) => void;
  language: string;
  height?: string;
}

// Theme configurations for Monaco Editor
const lightTheme = {
  base: "vs",
  inherit: true,
  rules: [],
  colors: {
    "editor.background": "#ffffff",
    "editor.foreground": "#000000",
    "editor.lineHighlightBackground": "#f5f5f5",
    "editor.selectionBackground": "#e8e8e8",
    "editor.inactiveSelectionBackground": "#e8e8e8",
  },
};

const darkTheme = {
  base: "vs-dark",
  inherit: true,
  rules: [],
  colors: {
    "editor.background": "#1a1a1a",
    "editor.foreground": "#ffffff",
    "editor.lineHighlightBackground": "#2a2a2a",
    "editor.selectionBackground": "#404040",
    "editor.inactiveSelectionBackground": "#404040",
  },
};

export function CodeEditor({
  value,
  onChange,
  language,
  height = "400px",
}: CodeEditorProps) {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Handle hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleBeforeMount: BeforeMount = useCallback((monaco) => {
    // Define custom themes
    monaco.editor.defineTheme("custom-light", lightTheme);
    monaco.editor.defineTheme("custom-dark", darkTheme);
  }, []);

  const handleEditorMount: OnMount = useCallback((editor, monaco) => {
    // Performance optimizations
    editor.updateOptions({
      renderWhitespace: "none",
      minimap: { enabled: false },
      folding: false,
      lineNumbers: "on",
      renderLineHighlight: "line",
      scrollBeyondLastLine: false,
      automaticLayout: true,
      tabSize: 2,
      wordWrap: "on",
      padding: { top: 16, bottom: 16 },
      fontSize: 14,
      fontFamily: "var(--font-mono)",
      suggestOnTriggerCharacters: true,
      quickSuggestions: true,
      bracketPairColorization: {
        enabled: true,
      },
      guides: {
        bracketPairs: true,
        indentation: true,
      },
    });

    // Add any editor customizations here
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      // Handle save shortcut
    });
  }, []);

  if (!mounted) {
    return <Skeleton className="h-[400px] w-full" />;
  }

  const currentTheme = theme === "system" ? systemTheme : theme;

  return (
    <div className="border rounded-lg overflow-hidden">
      <Editor
        height={height}
        defaultLanguage={language.toLowerCase()}
        value={value}
        onChange={onChange}
        theme={currentTheme === "dark" ? "custom-dark" : "custom-light"}
        loading={<Skeleton className="h-[400px] w-full" />}
        beforeMount={handleBeforeMount}
        onMount={handleEditorMount}
        options={{
          renderWhitespace: "none",
          minimap: { enabled: false },
          folding: false,
        }}
      />
    </div>
  );
}
