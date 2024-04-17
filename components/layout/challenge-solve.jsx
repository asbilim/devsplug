"use client";
import { Button } from "../ui/button";
import Link from "next/link";
import { Textarea } from "../ui/textarea";
import SyntaxHighlighter from "react-syntax-highlighter";
import html2canvas from "html2canvas";
import { CircleChevronRight, ImageDown, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { submitCodeImage } from "@/data/add-problem";
import { Badge } from "@/components/ui/badge";

import {
  a11yDark,
  a11yLight,
  agate,
  anOldHope,
  androidstudio,
  arduinoLight,
  arta,
  ascetic,
  atelierCaveDark,
  atelierCaveLight,
  atelierDuneDark,
  atelierDuneLight,
  atelierEstuaryDark,
  atelierEstuaryLight,
  atelierForestDark,
  atelierForestLight,
  atelierHeathDark,
  atelierHeathLight,
  atelierLakesideDark,
  atelierLakesideLight,
  atelierPlateauDark,
  atelierPlateauLight,
  atelierSavannaDark,
  atelierSavannaLight,
  atelierSeasideDark,
  atelierSeasideLight,
  atelierSulphurpoolDark,
  atelierSulphurpoolLight,
  atomOneDarkReasonable,
  atomOneDark,
  atomOneLight,
  brownPaper,
  codepenEmbed,
  colorBrewer,
  darcula,
  dark,
  defaultStyle,
  docco,
  dracula,
  far,
  foundation,
  githubGist,
  github,
  gml,
  googlecode,
  gradientDark,
  grayscale,
  gruvboxDark,
  gruvboxLight,
  hopscotch,
  hybrid,
  idea,
  irBlack,
  isblEditorDark,
  isblEditorLight,
  kimbieDark,
  kimbieLight,
  lightfair,
  lioshi,
  magula,
  monoBlue,
  monokaiSublime,
  monokai,
  nightOwl,
  nnfxDark,
  nnfx,
  nord,
  obsidian,
  ocean,
  paraisoDark,
  paraisoLight,
  pojoaque,
  purebasic,
  qtcreatorDark,
  qtcreatorLight,
  railscasts,
  rainbow,
  routeros,
  schoolBook,
  shadesOfPurple,
  solarizedDark,
  solarizedLight,
  srcery,
  stackoverflowDark,
  stackoverflowLight,
  sunburst,
  tomorrowNightBlue,
  tomorrowNightBright,
  tomorrowNightEighties,
  tomorrowNight,
  tomorrow,
  vs,
  vs2015,
  xcode,
  xt256,
  zenburn,
} from "react-syntax-highlighter/dist/esm/styles/hljs";

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
import { useState, useEffect, useRef, Suspense } from "react";
import { useForm } from "react-hook-form";
import uuid from "react-uuid";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { getSingleProblemQuizStatus } from "@/data/get-problems";
import ActionButton from "../buttons/action-button";
import { answerQuestion } from "@/data/add-problem";
import { createProblemQuiz } from "@/data/add-problem";
import { getProblemScore } from "@/data/get-problems";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Smile, Camera, SendHorizontal, TriangleAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import ChallengeLoading from "../pages/states/challenge-loading";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
const switchStyle = (styleName) => {
  switch (styleName) {
    case "a11yDark":
      return a11yDark;
    case "a11yLight":
      return a11yLight;
    case "agate":
      return agate;
    case "anOldHope":
      return anOldHope;
    case "androidstudio":
      return androidstudio;
    case "arduinoLight":
      return arduinoLight;
    case "arta":
      return arta;
    case "ascetic":
      return ascetic;
    case "atelierCaveDark":
      return atelierCaveDark;
    case "atelierCaveLight":
      return atelierCaveLight;
    case "atelierDuneDark":
      return atelierDuneDark;
    case "atelierDuneLight":
      return atelierDuneLight;
    case "atelierEstuaryDark":
      return atelierEstuaryDark;
    case "atelierEstuaryLight":
      return atelierEstuaryLight;
    case "atelierForestDark":
      return atelierForestDark;
    case "atelierForestLight":
      return atelierForestLight;
    case "atelierHeathDark":
      return atelierHeathDark;
    case "atelierHeathLight":
      return atelierHeathLight;
    case "atelierLakesideDark":
      return atelierLakesideDark;
    case "atelierLakesideLight":
      return atelierLakesideLight;
    case "atelierPlateauDark":
      return atelierPlateauDark;
    case "atelierPlateauLight":
      return atelierPlateauLight;
    case "atelierSavannaDark":
      return atelierSavannaDark;
    case "atelierSavannaLight":
      return atelierSavannaLight;
    case "atelierSeasideDark":
      return atelierSeasideDark;
    case "atelierSeasideLight":
      return atelierSeasideLight;
    case "atelierSulphurpoolDark":
      return atelierSulphurpoolDark;
    case "atelierSulphurpoolLight":
      return atelierSulphurpoolLight;
    case "atomOneDarkReasonable":
      return atomOneDarkReasonable;
    case "atomOneDark":
      return atomOneDark;
    case "atomOneLight":
      return atomOneLight;
    case "brownPaper":
      return brownPaper;
    case "codepenEmbed":
      return codepenEmbed;
    case "colorBrewer":
      return colorBrewer;
    case "darcula":
      return darcula;
    case "dark":
      return dark;
    case "defaultStyle":
      return defaultStyle;
    case "docco":
      return docco;
    case "dracula":
      return dracula;
    case "far":
      return far;
    case "foundation":
      return foundation;
    case "githubGist":
      return githubGist;
    case "github":
      return github;
    case "gml":
      return gml;
    case "googlecode":
      return googlecode;
    case "gradientDark":
      return gradientDark;
    case "grayscale":
      return grayscale;
    case "gruvboxDark":
      return gruvboxDark;
    case "gruvboxLight":
      return gruvboxLight;
    case "hopscotch":
      return hopscotch;
    case "hybrid":
      return hybrid;
    case "idea":
      return idea;
    case "irBlack":
      return irBlack;
    case "isblEditorDark":
      return isblEditorDark;
    case "isblEditorLight":
      return isblEditorLight;
    case "kimbieDark":
      return kimbieDark;
    case "kimbieLight":
      return kimbieLight;
    case "lightfair":
      return lightfair;
    case "lioshi":
      return lioshi;
    case "magula":
      return magula;
    case "monoBlue":
      return monoBlue;
    case "monokaiSublime":
      return monokaiSublime;
    case "monokai":
      return monokai;
    case "nightOwl":
      return nightOwl;
    case "nnfxDark":
      return nnfxDark;
    case "nnfx":
      return nnfx;
    case "nord":
      return nord;
    case "obsidian":
      return obsidian;
    case "ocean":
      return ocean;
    case "paraisoDark":
      return paraisoDark;
    case "paraisoLight":
      return paraisoLight;
    case "pojoaque":
      return pojoaque;
    case "purebasic":
      return purebasic;
    case "qtcreatorDark":
      return qtcreatorDark;
    case "qtcreatorLight":
      return qtcreatorLight;
    case "railscasts":
      return railscasts;
    case "rainbow":
      return rainbow;
    case "routeros":
      return routeros;
    case "schoolBook":
      return schoolBook;
    case "shadesOfPurple":
      return shadesOfPurple;
    case "solarizedDark":
      return solarizedDark;
    case "solarizedLight":
      return solarizedLight;
    case "srcery":
      return srcery;
    case "stackoverflowDark":
      return stackoverflowDark;
    case "stackoverflowLight":
      return stackoverflowLight;
    case "sunburst":
      return sunburst;
    case "tomorrowNightBlue":
      return tomorrowNightBlue;
    case "tomorrowNightBright":
      return tomorrowNightBright;
    case "tomorrowNightEighties":
      return tomorrowNightEighties;
    case "tomorrowNight":
      return tomorrowNight;
    case "tomorrow":
      return tomorrow;
    case "vs":
      return vs;
    case "vs2015":
      return vs2015;
    case "xcode":
      return xcode;
    case "xt256":
      return xt256;
    case "zenburn":
      return zenburn;
    default:
      return docco; // Fallback to a default style if none is matched
  }
};

export default function ChallengeSolve({ problem, quiz, slug }) {
  const [showQuiz, setShowQuiz] = useState(false);
  const [loading, setLoading] = useState(false);
  const [quizzes, setQuizzes] = useState([]);
  const { data: session, update } = useSession();

  const [full, setFull] = useState(false);

  const router = useRouter();
  const onclick = async () => {
    const token = session?.accessToken;

    if (!token) {
      return toast("Please we are still fetching your informations", {
        description:
          "The system is still fetching your datas , wait few seconds and try again",

        action: {
          label: "retry",
          onClick: () => console.log("Undo"),
        },
      });
    }
    try {
      const result = await getSingleProblemQuizStatus(token, {
        problem_slug: slug,
      });

      const res = await createProblemQuiz(
        { problem_slug: problem?.slug },
        session?.accessToken
      );

      setLoading(true);
      setQuizzes(result);
      setShowQuiz(!showQuiz);
      setLoading(false);
    } catch (e) {
      return toast("Please we are still fetching your informations", {
        description: e.message,

        action: {
          label: "retry",
          onClick: () => console.log("Undo"),
        },
      });
    }
  };

  return (
    <div className="flex px-12 my-24 items-center justify-center flex-col gap-24 overflow-hidden">
      <div className="flex md:gap-12 gap-2  md:w-full max-w-sm  md:max-w-6xl">
        <Button className="w-full">
          <Link href={`/problems/details/${problem?.slug}`}>
            Back to problem
          </Link>
        </Button>
        <Button variant="secondary" className="w-full border-4">
          Submit my answer
        </Button>
      </div>
      <div className="flex gap-12  w-full max-w-6xl flex-col">
        <h1 className="md:text-4xl font-bold p-6 text-center border-dashed   border-4">
          {problem?.title}
        </h1>
      </div>
      <CodeForm quiz={quiz} />
      {showQuiz && (
        <Suspense fallback={<ChallengeLoading />}>
          <QuizLayout
            quiz={quizzes}
            token={session?.accessToken}
            slug={problem?.slug}
            setquiz={setQuizzes}
            is_full={full}
          />
        </Suspense>
      )}

      {showQuiz ? (
        <ActionButton
          variant=""
          className="border-2"
          icon={CircleChevronRight}
          iClassName="mx-4"
          isLoading={loading}
          onclick={() => router.push("/leaderboard")}
        >
          View the leaderboard
        </ActionButton>
      ) : (
        <ActionButton
          variant=""
          className="border-2"
          icon={CircleChevronRight}
          iClassName="mx-4"
          isLoading={loading}
          onclick={() => onclick()}
        >
          Take the quiz and submit your answer
        </ActionButton>
      )}
    </div>
  );
}

const CodeForm = () => {
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
  const [scale, setScale] = useState(0);
  const { user } = session || false;
  const imageRef = useRef(null);
  const unique_id = uuid();
  const [showErrorMessage, setErrorMessage] = useState(false);
  const [partList, setPartList] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);

  const onSubmit = (data) => {
    data.parts = partList;
    console.log(data);
  };

  const onclick = () => {
    if (imageRef.current) {
      html2canvas(imageRef.current, {
        scale: scale,
      }).then((canvas) => {
        const image = canvas.toDataURL("image/jpeg");

        const link = document.createElement("a");
        link.href = image;
        link.download = user ? user.username + "-" + unique_id : unique_id;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    }
  };

  const onError = (errors, e) => {
    console.log(errors);
    console.log(e);
    setErrorMessage(true);
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
      className="flex flex-col px-12 md:px-0 md:gap-12 gap-2  md:w-full  w-[25rem]   md:max-w-6xl"
      onSubmit={handleSubmit(onSubmit, onError)}
    >
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
          {...register("scale", { required: true })}
          onValueChange={(value) => {
            setValue("scale", value);
            setScale(value);
            console.log(scale);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Choose scale" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Scale</SelectLabel>
              {Array.from({ length: 30 }, (_, i) => i + 1).map((number) => (
                <SelectItem value={number + ""} key={number}>
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
        <Button type="submit" variant="outline" onClick={() => onclick()}>
          Save to device <ImageDown className="mx-4" />
        </Button>
      </div>
      {showErrorMessage && (
        <div className="flex bg-red-950 text-sm text-red-200 tracking-widest border-2 border-red-100 p-3">
          please make sure you fill all the fields including scale , language
          and style
        </div>
      )}
      <div className="flex gap-3 flex-wrap">
        <div className="flex">
          <Input
            placeholder="give a name to this code"
            {...register("name", { required: true })}
          />
        </div>
        <span
          className={` cursor-pointer ${buttonVariants({ variant: "link" })}`}
          variant="outline"
          type=""
          onClick={() => {
            setModalOpen(!isModalOpen);
            isModalOpen && imageRef?.current?.focus();
          }}
        >
          Add code parts <Plus className="mx-2" />{" "}
        </span>

        <Button type="submit">I submit my code</Button>
      </div>
      <div className="flex">
        <div className="grid grid-cols-4 gap-4 place-items-center justify-center">
          {partList.map((item, index) => {
            return (
              <div key={index}>
                <Badge className="text-center">
                  {item.name}
                  <span
                    className={` cursor-pointer ${buttonVariants({})}`}
                    onClick={() => {
                      setPartList(
                        partList.filter(
                          (el) =>
                            el.name.toLowerCase().replaceAll(" ") !==
                              item.name.toLowerCase().replaceAll(" ") &&
                            el.code.toLowerCase().replaceAll("") !==
                              item.code.toLowerCase().replaceAll(" ")
                        )
                      );
                    }}
                  >
                    <X size={20} className="" />
                  </span>
                </Badge>
              </div>
            );
          })}
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
          className="flex w-auto flex-col image  bg-primary p-4 min-w-max"
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
      )}
    </form>
  );
};

const QuizLayout = ({ quiz, token, slug, setquiz, is_full }) => {
  const size = quiz?.length;
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(false);
  const viewScore = async () => {
    setLoading(true);
    try {
      const result = await getProblemScore(token, { problem_slug: slug });

      setScore(result.score);
    } catch (e) {
      return toast("Something went wrong", {
        description: "we are having a problem fetching your score",
        action: {
          label: "retry",
          onClick: () => viewScore(),
        },
      });
    } finally {
      setLoading(false);
    }
  };

  function findNextQuestionId(questions) {
    for (let i = 0; i < questions.length; i++) {
      if (!questions[i].is_submitted) {
        return questions[i].id;
      }
    }
    return null;
  }

  const currentQuestionId = findNextQuestionId(quiz);

  const getButtonState = (item) => {
    if (item.id === currentQuestionId) return "current";
    return item.is_submitted ? "done" : "coming";
  };

  const renderCurrentQuestion = () => {
    const currentQuestion = quiz.find((q) => q.id === currentQuestionId);

    return currentQuestion ? (
      <RenderQuestion
        quiz={quiz}
        content={currentQuestion}
        question_id={currentQuestion.id}
        token={token}
        slug={slug}
        setquiz={setquiz}
      />
    ) : (
      <div className="flex flex-col gap-6 min-w-lg w-full">
        <Alert>
          <Smile className="h-4 w-4" />
          <AlertTitle>Hey Hero </AlertTitle>
          <AlertDescription>
            <p>You have completed this challenge already!!</p>
            {/* {!is_full && <UploadCode token={token} slug={slug} />} */}
          </AlertDescription>
        </Alert>
        {score && (
          <p>
            this is your score: <strong>{score}</strong>
          </p>
        )}
        {!score && (
          <ActionButton
            isLoading={loading}
            variant=""
            onclick={() => viewScore()}
            iSize={25}
            iClassName="mx-4"
          >
            click to view your score
          </ActionButton>
        )}
      </div>
    );
  };

  return (
    <div className="flex items-center justify-center w-full flex-col gap-12">
      <div className="flex w-full max-w-6xl border-2 p-3">
        <div className={`grid w-full grid-cols-${size} place-items-center`}>
          {quiz.map((item) => {
            const state = getButtonState(item);
            return <QuizButton key={item.id.toString()} color={state} />;
          })}
        </div>
      </div>
      <div className="questions flex w-full max-w-6xl">
        {renderCurrentQuestion()}
      </div>
    </div>
  );
};

const QuizButton = ({ color }) => {
  const backgroundClass =
    color === "current"
      ? "border-4 p-2  animate-pulse ease-in"
      : color === "done"
      ? "bg-green-500 border-2 ring-2 ring-green-200"
      : "bg-transparent border-2";

  return (
    <div
      className={`flex rounded-full w-10 h-10 cursor-pointer ${backgroundClass} `}
    ></div>
  );
};

const RenderQuestion = ({
  content,
  question_id,
  token,
  slug,
  quiz,
  setquiz,
}) => {
  const [submittable, setSubmittable] = useState(false);
  const [answerId, setAnswerId] = useState(-5);
  const [loading, setLoading] = useState(false);

  const sendAnswer = async () => {
    setLoading(true);
    if (submittable) {
      const result = await answerQuestion(
        {
          question_id: question_id,
          selected_answer_id: answerId,
          problem_slug: slug,
        },
        token
      );

      setLoading(false);
      const newquiz = await getSingleProblemQuizStatus(token, {
        problem_slug: slug,
      });
      setquiz(newquiz);
      return toast("Question processed!!", {
        description: result.success,
        action: {
          label: "I understand",
          onClick: () => console.log("Undo"),
        },
      });
    } else {
      setLoading(false);
      return toast("Please select an answer", {
        description: "You need to select an option , to submit",

        action: {
          label: "I understand",
          onClick: () => console.log("Undo"),
        },
      });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <h3 className="font-semibold text-lg">{content?.title}</h3>
      <RadioGroup
        className="flex flex-col gap-6 "
        onValueChange={(value) => {
          setSubmittable(true);
          setAnswerId(value);
        }}
      >
        {content?.answers?.map((answer, index) => {
          return (
            <div className="flex items-center space-x-2" key={index + ""}>
              <RadioGroupItem
                value={answer.id}
                id={`r-${answer.id}`}
                defaultValue="comfortable"
              ></RadioGroupItem>
              <Label>
                <div
                  className="!w-full min-w-[100%] prose   prose-slate dark:prose-invert"
                  style={{ margin: 0 }}
                  dangerouslySetInnerHTML={{ __html: answer.content }}
                ></div>
              </Label>
            </div>
          );
        })}
      </RadioGroup>
      <div className="flex gap-4 my-12">
        <ActionButton
          className="px-12"
          onclick={() => sendAnswer()}
          isLoading={loading}
        >
          Submit
        </ActionButton>
        <Button variant="secondary">Skip</Button>
      </div>
    </div>
  );
};

const UploadCode = ({ token, slug }) => {
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setSelectedFile(file);
    }
  };
  const handleSubmit = async () => {
    setLoading(true);
    if (selectedFile) {
      const formData = new FormData();
      formData.append("image_code", selectedFile);
      formData.append("problem_slug", slug);

      try {
        const result = await submitCodeImage(formData, token);

        return toast("Sending code info", {
          description: result.error || result.success || result.detail,
          action: {
            label: "Thanks",
            onClick: () => alert("thank you too :-)"),
          },
        });
      } catch (e) {
        return toast("Something went wrong", {
          description: e.message,
          action: {
            label: "retry",
            onClick: () => handleSubmit(),
          },
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col p-4 gap-6">
      <input
        type="file"
        className="w-0 h-0"
        id="code"
        accept=".png,.svg,.jpg,.jpeg"
        onChange={handleFileChange}
      />
      <label
        htmlFor="code"
        className="image bg-secondary flex items-center justify-center min-h-[35vh] bg-cover"
        style={{
          backgroundImage: imagePreview ? `url(${imagePreview})` : "none",
        }}
      >
        {!imagePreview && <Camera size={65} />}
      </label>
      <div className="w-full max-w-2xl">
        <ActionButton
          variant=""
          onclick={() => handleSubmit()}
          icon={SendHorizontal}
          isLoading={loading}
        >
          Evaluate my code and give my score
        </ActionButton>
      </div>
    </div>
  );
};

const ReusableCodeForm = ({
  scale = 1,
  style,
  language,
  partlist,
  setpartlist,
}) => {
  const { register, handleSubmit, watch } = useForm();
  const [code, setCode] = useState("");
  const [partname, setPartName] = useState("");
  const { data: session } = useSession();
  const { user } = session || false;
  const imagePartRef = useRef(null);
  const unique_id = uuid();

  const onSubmit = (data) => {
    console.log(data);
  };

  const onclick = () => {
    if (imagePartRef.current) {
      html2canvas(imagePartRef.current, {
        scale: scale,
      }).then((canvas) => {
        const image = canvas.toDataURL("image/jpeg");
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
      if (name === "partname") {
        setPartName(value.partname);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  return (
    <div className="flex flex-col  md:gap-12 gap-2  md:w-full     md:max-w-6xl">
      <Textarea
        defaultValue={code}
        className="min-h-[15rem]"
        autofocus
        placeholder="Enter the other parts of your code , functions or any other part , this will be attached to your main code..."
        onValueChange={(value) => setCode(value)}
        {...register("codeValue", { required: true })}
      />

      <div className="flex gap-3 flex-wrap">
        <div className="flex">
          <Input
            {...register("partname", { required: true })}
            defaultValue={partname}
            placeholder="your code part name"
            maxLength="25"
            onValueChange={(value) => {
              if (value.length > 25) {
                return false;
              }
              setPartName(value);
            }}
          />
        </div>

        <span
          className={` cursor-pointer ${buttonVariants({
            variant: "outline",
          })}`}
          variant="outline"
          type=""
          onClick={() => {
            onclick();
          }}
        >
          Save to device <ImageDown className="mx-4" />
        </span>
        <Button
          onClick={(e) => {
            e.preventDefault();
            if (!partname) {
              console.log("there is no name");
            }
            const exists = partlist.map(
              (item) =>
                item.name.toLowerCase().replaceAll(" ") ===
                partname.toLowerCase().replaceAll(" ")
            );

            if (!exists[0]) {
              setpartlist([...partlist, { code: code, name: partname }]);
            }
          }}
        >
          Add to code <Plus className="mx-4" />
        </Button>
      </div>

      <div
        className="flex w-auto flex-col image  bg-primary p-4 min-w-max"
        ref={imagePartRef}
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
    </div>
  );
};
