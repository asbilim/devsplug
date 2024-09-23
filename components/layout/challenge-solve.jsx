"use client";
import { Button } from "../ui/button";
import Link from "next/link";
import { Textarea } from "../ui/textarea";
import SyntaxHighlighter from "react-syntax-highlighter";
import html2canvas from "html2canvas";
import { ImageDown, Plus, X } from "lucide-react";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { addProblemSolution } from "@/data/get-problems";
import { switchStyle } from "./styles";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { useToast } from "../ui/use-toast";
import supportedLanguages from "react-syntax-highlighter/dist/cjs/languages/hljs/supported-languages";
import { useSession } from "next-auth/react";
import { Input } from "../ui/input";
import { buttonVariants } from "../ui/button";
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
import MarkdownInput from "../inputs/markdown";

export default function ChallengeSolve({ problem, slug }) {
  const { data: session } = useSession();

  return (
    <div className="flex px-12 my-24 items-center justify-center flex-col gap-24 overflow-hidden">
      <div className="flex md:gap-12 gap-2 md:w-full max-w-sm md:max-w-6xl">
        <Button className="w-full">
          <Link href={`/problems/details/${problem?.slug}`}>
            Back to problem
          </Link>
        </Button>
        <Button variant="secondary" className="w-full border-4">
          Submit my answer
        </Button>
      </div>
      <div className="flex gap-12 w-full max-w-6xl flex-col">
        <h1 className="md:text-4xl font-bold p-6 text-center border-dashed border-4">
          {problem?.title}
        </h1>
      </div>
      <CodeForm slug={slug} />
    </div>
  );
}

const CodeForm = ({ slug = "" }) => {
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm();
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [style, setStyle] = useState(docco);
  const { data: session } = useSession();
  const [scale, setScale] = useState(1);
  const { user } = session || {};
  const imageRef = useRef(null);
  const unique_id = uuid();
  const [showErrorMessage, setErrorMessage] = useState(false);
  const [partList, setPartList] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    data.parts = partList;
    data.code = data.codeValue;
    data.problem_item = slug;
    try {
      const response = await addProblemSolution(
        session.accessToken,
        slug,
        data
      );

      if (response.status === "success") {
        toast({
          title: "Your solution was added successfully",
          description: (
            <div className="mt-2 w-[340px] rounded-md bg-green-950 p-4">
              <code className="text-green-200 overflow-auto">
                {JSON.stringify({ data: response?.content }, null, 2)}
              </code>
            </div>
          ),
        });
      } else {
        toast({
          title: "Something went wrong",
          description: (
            <div className="mt-2 w-[340px] rounded-md bg-red-950 p-4">
              <code className="text-red-200 overflow-auto">
                {JSON.stringify({ data: response?.content }, null, 2)}
              </code>
            </div>
          ),
        });
      }
    } catch (e) {
      toast({
        title: "An error occurred",
        description: (
          <div className="mt-2 w-[340px] rounded-md bg-red-950 p-4">
            <code className="text-red-200 overflow-auto">
              {JSON.stringify({ data: e.message }, null, 2)}
            </code>
          </div>
        ),
      });
    } finally {
      setLoading(false);
    }
  };

  const onError = () => {
    setErrorMessage(true);
  };

  const onclick = () => {
    if (imageRef.current) {
      html2canvas(imageRef.current, {
        scale: scale,
      }).then((canvas) => {
        const image = canvas.toDataURL("image/jpeg");
        const link = document.createElement("a");
        link.href = image;
        link.download = user ? `${user.username}-${unique_id}` : unique_id;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    }
  };

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "codeValue") {
        setCode(value.codeValue);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  return (
    <form
      className="flex flex-col px-12 md:px-0 md:gap-12 gap-2 md:w-full w-[25rem] md:max-w-6xl"
      onSubmit={handleSubmit(onSubmit, onError)}>
      <Textarea
        defaultValue={code}
        className="min-h-[15rem]"
        placeholder="Paste your code here"
        onValueChange={(value) => setCode(value)}
        {...register("codeValue", { required: true })}
      />
      <div className="flex gap-3 flex-wrap">
        <Select
          {...register("language", { required: true })}
          onValueChange={(value) => {
            setValue("language", value);
            setLanguage(value);
          }}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Choose language" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Languages</SelectLabel>
              {supportedLanguages.map((language, i) => (
                <SelectItem value={language} key={i}>
                  {language}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select
          {...register("scale", { required: true })}
          onValueChange={(value) => {
            setValue("scale", value);
            setScale(value);
          }}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Choose scale" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Scale</SelectLabel>
              {Array.from({ length: 30 }, (_, i) => i + 1).map((number) => (
                <SelectItem value={number.toString()} key={number}>
                  {number}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select
          {...register("style", { required: true })}
          onValueChange={(value) => {
            setValue("style", value);
            setStyle(switchStyle(value));
          }}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Choose style" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Styles</SelectLabel>
              {/* Add SelectItems for each style as needed */}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button type="button" variant="outline" onClick={onclick}>
          Save to device <ImageDown className="mx-4" />
        </Button>
      </div>
      {showErrorMessage && (
        <div className="flex bg-red-950 text-sm text-red-200 tracking-widest border-2 border-red-100 p-3">
          Please make sure you fill all the fields including scale, language,
          and style.
        </div>
      )}
      <div className="flex flex-col ">
        <Label htmlFor="description">
          Tell us about this code, and how to use it
        </Label>
        <MarkdownInput
          name="description"
          initialContent={watch("description") || ""}
          onSave={(markdown) => {
            setValue("description", markdown);
          }}
          placeholder="This code takes params as input and..."
        />
      </div>
      <div className="flex gap-3 flex-wrap">
        <div className="flex">
          <Input
            placeholder="Give a name to this code"
            {...register("name", { required: true })}
          />
        </div>
        <span
          className={`cursor-pointer ${buttonVariants({ variant: "link" })}`}
          onClick={() => {
            setModalOpen(!isModalOpen);
            isModalOpen && imageRef?.current?.focus();
          }}>
          Add code parts <Plus className="mx-2" />
        </span>
        <Button variant="" type="submit" isLoading={isLoading}>
          I submit my code
        </Button>
      </div>
      <div className="flex">
        <div className="grid md:grid-cols-4 gap-4 place-items-start justify-center">
          {partList.map((item, index) => (
            <div key={index}>
              <Badge className="text-center truncate text-wrap text-xs">
                {item.name}
                <span
                  className={`cursor-pointer text-xs ${buttonVariants({})}`}
                  onClick={() => {
                    setPartList(
                      partList.filter(
                        (el) =>
                          el.name.toLowerCase().trim() !==
                            item.name.toLowerCase().trim() &&
                          el.code.toLowerCase().trim() !==
                            item.code.toLowerCase().trim()
                      )
                    );
                    toast({
                      title: `${item.name} was removed`,
                      description: (
                        <div className="mt-2 w-[340px] rounded-md bg-red-950 p-4">
                          <code className="text-red-200 overflow-auto">
                            {JSON.stringify(
                              {
                                data: `${item.name} was removed from the list of functions`,
                              },
                              null,
                              2
                            )}
                          </code>
                        </div>
                      ),
                    });
                  }}>
                  <X size={20} />
                </span>
              </Badge>
            </div>
          ))}
        </div>
      </div>
      {isModalOpen && (
        <ReusableCodeForm
          partlist={partList}
          setpartlist={setPartList}
          language={language}
          scale={scale}
          style={style}
        />
      )}
      {!isModalOpen && (
        <div
          className="flex w-auto flex-col image bg-primary p-4 min-w-max"
          ref={imageRef}>
          <div className="flex justify-between p-3 rounded-lg">
            <h2 className="font-bold text-secondary">Devsplug</h2>
            <h4 className="font-medium text-secondary text-xs">
              Code by {user ? user.username : "loading..."}
            </h4>
          </div>
          <SyntaxHighlighter
            language={language}
            style={style}
            className="w-full"
            showLineNumbers>
            {code}
          </SyntaxHighlighter>
        </div>
      )}
    </form>
  );
};

const ReusableCodeForm = ({
  scale = 1,
  style,
  language,
  partlist,
  setpartlist,
}) => {
  const { register, watch } = useForm();
  const [code, setCode] = useState("");
  const [partname, setPartName] = useState("");
  const { data: session } = useSession();
  const { user } = session || {};
  const imagePartRef = useRef(null);
  const unique_id = uuid();
  const [description, setDescription] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "codeValue") {
        setCode(value.codeValue);
      }
      if (name === "partname") {
        setPartName(value.partname);
      }
      if (name === "part-description") {
        setDescription(value["part-description"]);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const onclick = () => {
    if (imagePartRef.current) {
      html2canvas(imagePartRef.current, {
        scale: scale,
      }).then((canvas) => {
        const image = canvas.toDataURL("image/jpeg");
        const link = document.createElement("a");
        link.href = image;
        link.download = user ? `${user.username}-${unique_id}` : unique_id;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    }
  };

  return (
    <div className="flex flex-col md:gap-12 gap-2 md:w-full md:max-w-6xl">
      <Textarea
        defaultValue={code}
        className="min-h-[15rem]"
        autoFocus
        placeholder="Enter other parts of your code, functions, or any other part..."
        onValueChange={(value) => setCode(value)}
        {...register("codeValue", { required: true })}
      />
      <div className="flex flex-col md:w-2/4">
        <Label htmlFor="part-description">
          Tell us about this part of your solution
        </Label>
        <Textarea
          defaultValue={description}
          onValueChange={(value) => setDescription(value)}
          {...register("part-description")}
          placeholder="This code takes params as input and..."
          id="part-description"
        />
      </div>
      <div className="flex gap-3 flex-wrap">
        <div className="flex">
          <Input
            {...register("partname", { required: true })}
            defaultValue={partname}
            placeholder="Your code part name"
            maxLength="100"
            onValueChange={(value) => setPartName(value)}
          />
        </div>
        <span
          className={`cursor-pointer ${buttonVariants({ variant: "outline" })}`}
          onClick={onclick}>
          Save to device <ImageDown className="mx-4" />
        </span>
        <Button
          onClick={(e) => {
            e.preventDefault();
            if (partname.trim() === "") {
              return;
            }
            const exists = partlist.some(
              (item) =>
                item.name.toLowerCase().trim() === partname.toLowerCase().trim()
            );

            if (!exists) {
              toast({
                title: `${partname} was added to the functions`,
                description: (
                  <div className="mt-2 w-[340px] rounded-md bg-green-950 p-4">
                    <code className="text-green-200 overflow-auto">
                      {JSON.stringify(
                        {
                          data: `${partname} is now in the list of your main code functions`,
                        },
                        null,
                        2
                      )}
                    </code>
                  </div>
                ),
              });
              setpartlist([...partlist, { code, name: partname, description }]);
            }
          }}>
          Add to code <Plus className="mx-4" />
        </Button>
      </div>
      <div
        className="flex w-auto flex-col image bg-primary p-4 min-w-max"
        ref={imagePartRef}>
        <div className="flex justify-between p-3 rounded-lg">
          <h2 className="font-bold text-secondary">Devsplug</h2>
          <h4 className="font-medium text-secondary text-xs">
            Code by {user ? user.username : "loading..."}
          </h4>
        </div>
        <SyntaxHighlighter
          language={language}
          style={style}
          className="w-full"
          showLineNumbers>
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};
