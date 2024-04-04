"use client";
import { useSession } from "next-auth/react";
import ReactMarkdown from "react-markdown";
import { Button } from "../ui/button";
import rehypeHighlight from "rehype-highlight";
import { Maximize } from "lucide-react";

export default function Motivation() {
  const { data: session } = useSession();
  const decoded = session?.user ? atob(session?.user?.motivation) : "";
  return (
    <div className="flex items-center justify-start mx-8 h-auto flex-col mt-16">
      <h2 className="text-start w-full max-w-6xl text-lg my-4">Your bio:</h2>
      <div className="flex border-4   w-full max-w-6xl ">
        <div
          className="p-6 tracking-wider leading-relaxed text-sm  max-h-[35vh] overflow-auto prose dark:prose-invert !w-full min-w-[100%]"
          style={{ margin: 0 }}
        >
          <ReactMarkdown rehypePlugins={rehypeHighlight}>
            {decoded}
          </ReactMarkdown>
        </div>
      </div>
      <div className="text-start w-full max-w-6xl text-lg my-4">
        <Button className="px-24">
          Expand <Maximize className="mx-4" size={24} />
        </Button>
      </div>
    </div>
  );
}
