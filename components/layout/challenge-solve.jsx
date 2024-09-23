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
              <SelectItem value="docco">Docco</SelectItem>
              <SelectItem value="dracula">Dracula</SelectItem>
              <SelectItem value="a11yLight">A11y Light</SelectItem>
              <SelectItem value="a11yDark">A11y Dark</SelectItem>
              <SelectItem value="agate">Agate</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="anOldHope">An Old Hope</SelectItem>
              <SelectItem value="androidstudio">Android Studio</SelectItem>
              <SelectItem value="arduinoLight">Arduino Light</SelectItem>
              <SelectItem value="arta">Arta</SelectItem>
              <SelectItem value="ascetic">Ascetic</SelectItem>
              <SelectItem value="atelierCaveDark">Atelier Cave Dark</SelectItem>
              <SelectItem value="atelierCaveLight">
                Atelier Cave Light
              </SelectItem>
              <SelectItem value="atelierDuneDark">Atelier Dune Dark</SelectItem>
              <SelectItem value="atelierDuneLight">
                Atelier Dune Light
              </SelectItem>
              <SelectItem value="atelierEstuaryDark">
                Atelier Estuary Dark
              </SelectItem>
              <SelectItem value="atelierEstuaryLight">
                Atelier Estuary Light
              </SelectItem>
              <SelectItem value="atelierForestDark">
                Atelier Forest Dark
              </SelectItem>
              <SelectItem value="atelierForestLight">
                Atelier Forest Light
              </SelectItem>
              <SelectItem value="atelierHeathDark">
                Atelier Heath Dark
              </SelectItem>
              <SelectItem value="atelierHeathLight">
                Atelier Heath Light
              </SelectItem>
              <SelectItem value="atelierLakesideDark">
                Atelier Lakeside Dark
              </SelectItem>
              <SelectItem value="atelierLakesideLight">
                Atelier Lakeside Light
              </SelectItem>
              <SelectItem value="atelierPlateauDark">
                Atelier Plateau Dark
              </SelectItem>
              <SelectItem value="atelierPlateauLight">
                Atelier Plateau Light
              </SelectItem>
              <SelectItem value="atelierSavannaDark">
                Atelier Savanna Dark
              </SelectItem>
              <SelectItem value="atelierSavannaLight">
                Atelier Savanna Light
              </SelectItem>
              <SelectItem value="atelierSeasideDark">
                Atelier Seaside Dark
              </SelectItem>
              <SelectItem value="atelierSeasideLight">
                Atelier Seaside Light
              </SelectItem>
              <SelectItem value="atelierSulphurpoolDark">
                Atelier Sulphurpool Dark
              </SelectItem>
              <SelectItem value="atelierSulphurpoolLight">
                Atelier Sulphurpool Light
              </SelectItem>
              <SelectItem value="atomOneDarkReasonable">
                Atom One Dark Reasonable
              </SelectItem>
              <SelectItem value="atomOneDark">Atom One Dark</SelectItem>
              <SelectItem value="atomOneLight">Atom One Light</SelectItem>
              <SelectItem value="brownPaper">Brown Paper</SelectItem>
              <SelectItem value="codepenEmbed">Codepen Embed</SelectItem>
              <SelectItem value="colorBrewer">Color Brewer</SelectItem>
              <SelectItem value="darcula">Darcula</SelectItem>
              <SelectItem value="defaultStyle">Default Style</SelectItem>
              <SelectItem value="far">FAR</SelectItem>
              <SelectItem value="foundation">Foundation</SelectItem>
              <SelectItem value="githubGist">Github Gist</SelectItem>
              <SelectItem value="github">Github</SelectItem>
              <SelectItem value="gml">GML</SelectItem>
              <SelectItem value="googlecode">Google Code</SelectItem>
              <SelectItem value="gradientDark">Gradient Dark</SelectItem>
              <SelectItem value="grayscale">Grayscale</SelectItem>
              <SelectItem value="gruvboxDark">Gruvbox Dark</SelectItem>
              <SelectItem value="gruvboxLight">Gruvbox Light</SelectItem>
              <SelectItem value="hopscotch">Hopscotch</SelectItem>
              <SelectItem value="hybrid">Hybrid</SelectItem>
              <SelectItem value="idea">IDEA</SelectItem>
              <SelectItem value="irBlack">IR Black</SelectItem>
              <SelectItem value="isblEditorDark">ISBL Editor Dark</SelectItem>
              <SelectItem value="isblEditorLight">ISBL Editor Light</SelectItem>
              <SelectItem value="kimbieDark">Kimbie Dark</SelectItem>
              <SelectItem value="kimbieLight">Kimbie Light</SelectItem>
              <SelectItem value="lightfair">Lightfair</SelectItem>
              <SelectItem value="lioshi">Lioshi</SelectItem>
              <SelectItem value="magula">Magula</SelectItem>
              <SelectItem value="monoBlue">Mono Blue</SelectItem>
              <SelectItem value="monokaiSublime">Monokai Sublime</SelectItem>
              <SelectItem value="monokai">Monokai</SelectItem>
              <SelectItem value="nightOwl">Night Owl</SelectItem>
              <SelectItem value="nnfxDark">NNFX Dark</SelectItem>
              <SelectItem value="nnfx">NNFX</SelectItem>
              <SelectItem value="nord">Nord</SelectItem>
              <SelectItem value="obsidian">Obsidian</SelectItem>
              <SelectItem value="ocean">Ocean</SelectItem>
              <SelectItem value="paraisoDark">Paraiso Dark</SelectItem>
              <SelectItem value="paraisoLight">Paraiso Light</SelectItem>
              <SelectItem value="pojoaque">Pojoaque</SelectItem>
              <SelectItem value="purebasic">PureBasic</SelectItem>
              <SelectItem value="qtcreatorDark">Qt Creator Dark</SelectItem>
              <SelectItem value="qtcreatorLight">Qt Creator Light</SelectItem>
              <SelectItem value="railscasts">RailsCasts</SelectItem>
              <SelectItem value="rainbow">Rainbow</SelectItem>
              <SelectItem value="routeros">RouterOS</SelectItem>
              <SelectItem value="schoolBook">School Book</SelectItem>
              <SelectItem value="shadesOfPurple">Shades of Purple</SelectItem>
              <SelectItem value="solarizedDark">Solarized Dark</SelectItem>
              <SelectItem value="solarizedLight">Solarized Light</SelectItem>
              <SelectItem value="srcery">Srcery</SelectItem>
              <SelectItem value="stackoverflowDark">
                Stack Overflow Dark
              </SelectItem>
              <SelectItem value="stackoverflowLight">
                Stack Overflow Light
              </SelectItem>
              <SelectItem value="sunburst">Sunburst</SelectItem>
              <SelectItem value="tomorrowNightBlue">
                Tomorrow Night Blue
              </SelectItem>
              <SelectItem value="tomorrowNightBright">
                Tomorrow Night Bright
              </SelectItem>
              <SelectItem value="tomorrowNightEighties">
                Tomorrow Night Eighties
              </SelectItem>
              <SelectItem value="tomorrowNight">Tomorrow Night</SelectItem>
              <SelectItem value="tomorrow">Tomorrow</SelectItem>
              <SelectItem value="vs">VS</SelectItem>
              <SelectItem value="vs2015">VS 2015</SelectItem>
              <SelectItem value="xcode">Xcode</SelectItem>
              <SelectItem value="xt256">XT 256</SelectItem>
              <SelectItem value="zenburn">Zenburn</SelectItem>
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
