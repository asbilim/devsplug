"use client";
import { Button } from "../ui/button";
import Link from "next/link";
import { Textarea } from "../ui/textarea";
import SyntaxHighlighter from "react-syntax-highlighter";
import html2canvas from "html2canvas";
import {
  docco,
  dracula,
  a11yLight,
  a11yDark,
  agate,
  dark,
} from "react-syntax-highlighter/dist/esm/styles/hljs";
import supportedLanguages from "react-syntax-highlighter/dist/cjs/languages/hljs/supported-languages";
import { useSession } from "next-auth/react";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import uuid from "react-uuid";
export default function ChallengeSolve({ problem }) {
  return (
    <div className="flex px-12 my-24 items-center justify-center flex-col gap-24">
      <div className="flex gap-12  w-full max-w-6xl">
        <Button className="w-full">Back to problem</Button>
        <Button variant="secondary" className="w-full border-4">
          Submit my answer
        </Button>
      </div>
      <div className="flex gap-12  w-full max-w-6xl flex-col">
        <h1 className="text-4xl font-bold p-6 text-center border-dashed   border-4">
          {problem?.title}
        </h1>
      </div>
      <CodeForm />
    </div>
  );
}

const CodeForm = () => {
  const { register, handleSubmit, watch } = useForm();
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [style, setStyle] = useState(docco);
  const { data: session } = useSession();
  const { user } = session || false;
  const imageRef = useRef(null);
  const unique_id = uuid();

  const switchStyle = (styleName) => {
    switch (styleName) {
      case "docco":
        return docco;
      case "dracula":
        return dracula;
      case "a11yLight":
        return a11yLight;
      case "a11yDark":
        return a11yDark;
      case "agate":
        return agate;
      case "dark":
        return dark;
      default:
        return docco;
    }
  };

  const onSubmit = (data) => {
    setCode(data.codeValue);
    console.log(data);
  };

  const onclick = () => {
    if (imageRef.current) {
      html2canvas(imageRef.current, { scale: 3 }).then((canvas) => {
        // Convert the canvas to an image
        const image = canvas.toDataURL("image/png");
        // Create a link to trigger the download
        const link = document.createElement("a");
        link.href = image;
        link.download = user ? user.username + "-" + unique_id : unique_id;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    }
  };

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (name === "codeValue") {
        setCode(value.codeValue);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  return (
    <form
      className="grid gap-6 w-full max-w-6xl"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Textarea
        defaultValue={code}
        className="min-h-[15rem]"
        placeholder="Paste your code here"
        onValueChange={(value) => setCode(value)}
        {...register("codeValue", { required: true })}
      />
      <div className="flex">
        <Select
          {...register("language", { required: true })}
          onValueChange={(value) => {
            setLanguage(value);
            console.log(value);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Choose language" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Languages</SelectLabel>
              {supportedLanguages.map((language, i) => (
                <SelectItem value={language} key={i + ""}>
                  {language}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select
          {...register("style", { required: true })}
          onValueChange={(value) => {
            setStyle(switchStyle(value));
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Choose style" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Styles</SelectLabel>
              <SelectItem value="docco">Docco</SelectItem>
              <SelectItem value="dracula">Dracula</SelectItem>
              <SelectItem value="a11yLight">A11y Light</SelectItem>
              <SelectItem value="a11yDark">A11y Dark</SelectItem>
              <SelectItem value="agate">Agate</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Input placeholder={`enter a name default:${unique_id}`} />
        <Button type="submit" onClick={() => onclick()}>
          Generate
        </Button>
      </div>
      <div
        className="flex w-full flex-col image  bg-primary p-4"
        ref={imageRef}
      >
        <div className="flex justify-between   p-3 rounded-lg">
          <h2 className="font-bold text-secondary">Devsplug</h2>
          <h4 className="font-medium text-secondary text-xs">
            code by {user ? user.username : "loading..."}
          </h4>
        </div>
        <SyntaxHighlighter
          language={language}
          style={style}
          className="w-full"
          showLineNumbers
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </form>
  );
};
