/**
 * Get visual indicator class based on language
 * @param language Programming language
 * @returns CSS color class for the language
 */
export function getLanguageColor(language: string): string {
  const normalizedLang = language.toLowerCase();

  switch (normalizedLang) {
    case "javascript":
    case "js":
      return "text-yellow-500 border-yellow-500/20 bg-yellow-500/10";
    case "typescript":
    case "ts":
      return "text-blue-500 border-blue-500/20 bg-blue-500/10";
    case "python":
    case "py":
      return "text-green-500 border-green-500/20 bg-green-500/10";
    case "java":
      return "text-orange-500 border-orange-500/20 bg-orange-500/10";
    case "c":
      return "text-blue-400 border-blue-400/20 bg-blue-400/10";
    case "c++":
    case "cpp":
      return "text-pink-500 border-pink-500/20 bg-pink-500/10";
    case "c#":
    case "csharp":
      return "text-purple-500 border-purple-500/20 bg-purple-500/10";
    case "go":
      return "text-cyan-500 border-cyan-500/20 bg-cyan-500/10";
    case "rust":
      return "text-orange-700 border-orange-700/20 bg-orange-700/10";
    case "ruby":
      return "text-red-500 border-red-500/20 bg-red-500/10";
    case "php":
      return "text-indigo-500 border-indigo-500/20 bg-indigo-500/10";
    case "swift":
      return "text-orange-500 border-orange-500/20 bg-orange-500/10";
    case "kotlin":
      return "text-purple-500 border-purple-500/20 bg-purple-500/10";
    case "dart":
      return "text-sky-500 border-sky-500/20 bg-sky-500/10";
    case "html":
      return "text-red-600 border-red-600/20 bg-red-600/10";
    case "css":
      return "text-blue-600 border-blue-600/20 bg-blue-600/10";
    default:
      return "text-gray-500 border-gray-500/20 bg-gray-500/10";
  }
}

/**
 * Get a file extension for a language
 * @param language Programming language
 * @returns File extension without the dot
 */
export function getFileExtension(language: string): string {
  const langMap: Record<string, string> = {
    javascript: "js",
    typescript: "ts",
    python: "py",
    java: "java",
    cpp: "cpp",
    "c++": "cpp",
    c: "c",
    csharp: "cs",
    "c#": "cs",
    go: "go",
    rust: "rs",
    php: "php",
    ruby: "rb",
    swift: "swift",
    kotlin: "kt",
    scala: "scala",
    html: "html",
    css: "css",
    sql: "sql",
    bash: "sh",
    shell: "sh",
  };

  const normalizedLang = language.toLowerCase();
  return langMap[normalizedLang] || "txt";
}

/**
 * Format code for display
 * @param code Code string
 * @param maxLines Maximum number of lines to show
 * @returns Formatted code with line count restriction and "..." indicator if truncated
 */
export function formatCodePreview(
  code: string | undefined,
  maxLines = 10
): string {
  if (!code) return "[No code provided]";

  const lines = code.split("\n");
  if (lines.length <= maxLines) return code;

  return lines.slice(0, maxLines).join("\n") + "\n// ...";
}
