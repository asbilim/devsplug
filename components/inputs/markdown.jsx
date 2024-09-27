"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { Markdown } from "tiptap-markdown";
import { createLowlight } from "lowlight";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";

import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Code,
  Quote,
  Link2 as LinkIcon,
  Image as ImageIcon,
  Clipboard,
  Undo,
  Redo,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";

const ToolbarButton = React.memo(({ icon, tooltip, onClick, isActive }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={isActive ? "secondary" : "ghost"}
          size="icon"
          className="w-8 h-8"
          onClick={onClick}
          aria-label={tooltip}>
          {icon}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
));

const lowlight = createLowlight();

// Function to unescape Markdown content
const unescapeMarkdown = (content) => {
  return content
    .replace(/\\#/g, "#")
    .replace(/\\\*/g, "*")
    .replace(/\\_/g, "_")
    .replace(/\\~/g, "~")
    .replace(/\\\[/g, "[")
    .replace(/\\\]/g, "]")
    .replace(/\\\(/g, "(")
    .replace(/\\\)/g, ")")
    .replace(/\\`/g, "`")
    .replace(/\\\\/g, "\\");
};

export default function MarkdownInput({
  initialContent = "",
  onSave,
  readOnly = false,
  placeholder = "Start writing...",
}) {
  const [activeTab, setActiveTab] = useState("write");
  const [linkUrl, setLinkUrl] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [codeLanguage, setCodeLanguage] = useState("javascript");
  const [markdownContent, setMarkdownContent] = useState(initialContent);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Link.configure({ openOnClick: false }),
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Placeholder.configure({
        placeholder: placeholder,
      }),
      CodeBlockLowlight.configure({
        lowlight,
        defaultLanguage: "javascript",
      }),
      Markdown,
    ],
    content: initialContent,
    editable: !readOnly,
    onUpdate: ({ editor }) => {
      const markdown = editor.storage.markdown.getMarkdown();
      setMarkdownContent(markdown);
      if (onSave) {
        onSave(markdown);
      }
    },
  });

  useEffect(() => {
    if (editor && initialContent) {
      editor.commands.setContent(initialContent);
    }
  }, [editor, initialContent]);

  const toolbarButtons = useMemo(
    () => [
      {
        icon: <Undo className="w-4 h-4" />,
        tooltip: "Undo",
        action: () => editor?.chain().focus().undo().run(),
      },
      {
        icon: <Redo className="w-4 h-4" />,
        tooltip: "Redo",
        action: () => editor?.chain().focus().redo().run(),
      },
      {
        icon: <Bold className="w-4 h-4" />,
        tooltip: "Bold",
        action: () => editor?.chain().focus().toggleBold().run(),
        isActive: () => editor?.isActive("bold"),
      },
      {
        icon: <Italic className="w-4 h-4" />,
        tooltip: "Italic",
        action: () => editor?.chain().focus().toggleItalic().run(),
        isActive: () => editor?.isActive("italic"),
      },
      {
        icon: <UnderlineIcon className="w-4 h-4" />,
        tooltip: "Underline",
        action: () => editor?.chain().focus().toggleUnderline().run(),
        isActive: () => editor?.isActive("underline"),
      },
      {
        icon: <List className="w-4 h-4" />,
        tooltip: "Bullet List",
        action: () => editor?.chain().focus().toggleBulletList().run(),
        isActive: () => editor?.isActive("bulletList"),
      },
      {
        icon: <ListOrdered className="w-4 h-4" />,
        tooltip: "Ordered List",
        action: () => editor?.chain().focus().toggleOrderedList().run(),
        isActive: () => editor?.isActive("orderedList"),
      },
      {
        icon: <Quote className="w-4 h-4" />,
        tooltip: "Blockquote",
        action: () => editor?.chain().focus().toggleBlockquote().run(),
        isActive: () => editor?.isActive("blockquote"),
      },
      {
        icon: <Code className="w-4 h-4" />,
        tooltip: "Code Block",
        action: () => {
          editor
            ?.chain()
            .focus()
            .toggleCodeBlock({ language: codeLanguage })
            .run();
        },
        isActive: () => editor?.isActive("codeBlock"),
      },
    ],
    [editor, codeLanguage]
  );

  const handleLinkSubmit = useCallback(() => {
    if (linkUrl) {
      editor
        ?.chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: linkUrl })
        .run();
    } else {
      editor?.chain().focus().unsetLink().run();
    }
    setLinkUrl("");
  }, [editor, linkUrl]);

  const handleMediaSubmit = useCallback(() => {
    if (mediaUrl) {
      try {
        new URL(mediaUrl);
        editor?.chain().focus().setImage({ src: mediaUrl }).run();
      } catch (error) {
        console.error("Invalid URL:", error);
        alert("Please enter a valid URL");
      }
    }
    setMediaUrl("");
  }, [editor, mediaUrl]);

  const handleCopyMarkdown = useCallback(() => {
    navigator.clipboard.writeText(markdownContent);
  }, [markdownContent]);

  const renderToolbar = useMemo(
    () => (
      <div className="flex flex-wrap gap-2 p-2 border-b border-gray-200 dark:border-gray-800">
        {toolbarButtons.map((button, index) => (
          <React.Fragment key={`${button.tooltip}-${index}`}>
            <ToolbarButton
              icon={button.icon}
              tooltip={button.tooltip}
              onClick={button.action}
              isActive={button.isActive && button.isActive()}
            />
            {(index + 1) % 4 === 0 && index !== toolbarButtons.length - 1 && (
              <Separator orientation="vertical" className="h-8" />
            )}
          </React.Fragment>
        ))}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8"
              aria-label="Insert Link">
              <LinkIcon className="w-4 h-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="grid gap-4 p-4">
              <Input
                placeholder="https://example.com"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                aria-label="Link URL"
              />
              <Button size="sm" onClick={handleLinkSubmit}>
                Insert Link
              </Button>
            </div>
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8"
              aria-label="Insert Media">
              <ImageIcon className="w-4 h-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="grid gap-4 p-4">
              <Input
                placeholder="https://example.com/image.jpg"
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                aria-label="Media URL"
              />
              <Button size="sm" onClick={handleMediaSubmit}>
                Insert Image
              </Button>
            </div>
          </PopoverContent>
        </Popover>
        <Button
          variant="ghost"
          size="icon"
          className="w-8 h-8"
          onClick={handleCopyMarkdown}
          aria-label="Copy Markdown">
          <Clipboard className="w-4 h-4" />
        </Button>
        <select
          value={codeLanguage}
          onChange={(e) => setCodeLanguage(e.target.value)}
          className="border p-1 rounded"
          aria-label="Select Code Language">
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="c">C</option>
          <option value="cpp">C++</option>
          <option value="rust">rust</option>
          <option value="dart">dart</option>
          <option value="sh">bash</option>
          <option value="php">Php</option>
          <option value="html">html</option>
        </select>
      </div>
    ),
    [
      toolbarButtons,
      linkUrl,
      mediaUrl,
      handleLinkSubmit,
      handleMediaSubmit,
      handleCopyMarkdown,
      codeLanguage,
    ]
  );

  const unescapedMarkdownContent = useMemo(
    () => unescapeMarkdown(markdownContent),
    [markdownContent]
  );

  return (
    <div className="max-w-[900px] bg-white dark:bg-gray-900 shadow-lg rounded-lg overflow-hidden">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="write">Write</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="markdown">Markdown</TabsTrigger>
        </TabsList>
        <TabsContent value="write" className="p-0">
          {renderToolbar}
          <ScrollArea className="h-[500px]">
            <EditorContent editor={editor} className="p-4" />
          </ScrollArea>
        </TabsContent>
        <TabsContent value="preview" className="p-4">
          <ScrollArea className="h-[500px]">
            <ReactMarkdown
              className="prose dark:prose-invert max-w-none"
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={vscDarkPlus}
                      language={match[1]}
                      PreTag="div"
                      {...props}>
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
              }}>
              {unescapedMarkdownContent}
            </ReactMarkdown>
          </ScrollArea>
        </TabsContent>
        <TabsContent value="markdown" className="p-4">
          <ScrollArea className="h-[500px]">
            <pre className="whitespace-pre-wrap">
              {unescapedMarkdownContent}
            </pre>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
