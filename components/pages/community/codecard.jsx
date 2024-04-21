"use client";
import { useState, useEffect } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import SyntaxHighlighter from "react-syntax-highlighter";
import ActionButton from "@/components/buttons/action-button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getSolutionsComments,
  getSolutionsLikes,
  getSolutionsDisLikes,
} from "@/data/get-problems";
import { Suspense } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
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
import { ArrowBigDown, ArrowBigUp, MessageSquareMore } from "lucide-react";
import { getTitleAttribute } from "@/data/name-icons";
import Link from "next/link";
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

export const SolutionCard = (props) => {
  const [likes, setLikes] = useState({});
  const [dislikes, setDisLikes] = useState({});
  const [comments, setComments] = useState({});
  const [likeAdding, setLikesAdding] = useState(false);
  const [disLikeAdding, setDisLikesAdding] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  const { toast } = useToast();

  const token = session?.accessToken;
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const addLike = async () => {
    setLikesAdding(true);
    if (!session || !token) {
      router.push("/auth/login");
    }

    try {
      const data = await fetch(backendUrl + "/challenges/likes/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          unique_code: props?.unique_code,
        }),
      });
      const response = await data.json();
      if (response.status == "success") {
        getDatas().then((answer) => {
          setLikes(answer.likes);
          setComments(answer.comments);
          setDisLikes(answer.dislikes);
        });
        toast({
          title: "Operation successful",
          description: (
            <div className="mt-2 w-[340px] rounded-md bg-green-950 p-4">
              <code className="text-green-200 overflow-auto">
                {JSON.stringify(
                  {
                    data: response?.content,
                  },
                  null,
                  2
                )}
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
                {JSON.stringify(
                  {
                    data: response?.content,
                  },
                  null,
                  2
                )}
              </code>
            </div>
          ),
        });
      }
    } catch (err) {
      toast({
        title: "Something went wrong",
        description: (
          <div className="mt-2 w-[340px] rounded-md bg-red-950 p-4">
            <code className="text-red-200 overflow-auto">
              {JSON.stringify(
                {
                  data: err.message,
                },
                null,
                2
              )}
            </code>
          </div>
        ),
      });
    } finally {
      setLikesAdding(false);
    }
  };

  const disLike = async () => {
    setDisLikesAdding(true);
    if (!session || !token) {
      router.push("/auth/login");
    }

    try {
      const data = await fetch(backendUrl + "/challenges/dislikes/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          unique_code: props?.unique_code,
        }),
      });
      const response = await data.json();
      if (response.status == "success") {
        getDatas().then((answer) => {
          setLikes(answer.likes);
          setComments(answer.comments);
          setDisLikes(answer.dislikes);
        });
        toast({
          title: "Operation successful",
          description: (
            <div className="mt-2 w-[340px] rounded-md bg-green-950 p-4">
              <code className="text-green-200 overflow-auto">
                {JSON.stringify(
                  {
                    data: response?.content,
                  },
                  null,
                  2
                )}
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
                {JSON.stringify(
                  {
                    data: response?.content,
                  },
                  null,
                  2
                )}
              </code>
            </div>
          ),
        });
      }
    } catch (err) {
      toast({
        title: "Something went wrong",
        description: (
          <div className="mt-2 w-[340px] rounded-md bg-red-950 p-4">
            <code className="text-red-200 overflow-auto">
              {JSON.stringify(
                {
                  data: err.message,
                },
                null,
                2
              )}
            </code>
          </div>
        ),
      });
    } finally {
      setDisLikesAdding(false);
    }
  };

  const getDatas = async () => {
    const likes = await getSolutionsLikes(props?.unique_code);
    const dislikes = await getSolutionsDisLikes(props?.unique_code);
    const comments = await getSolutionsComments(props?.unique_code);

    return { likes: likes, dislikes: dislikes, comments: comments };
  };

  useEffect(() => {
    const getDatas = async () => {
      const likes = await getSolutionsLikes(props?.unique_code);
      const dislikes = await getSolutionsDisLikes(props?.unique_code);
      const comments = await getSolutionsComments(props?.unique_code);

      return { likes: likes, dislikes: dislikes, comments: comments };
    };

    getDatas().then((answer) => {
      setLikes(answer.likes);
      setComments(answer.comments);
      setDisLikes(answer.dislikes);
    });
  }, [props]);

  return (
    <div className="flex  flex-col gap-3 max-w-[22rem] md:max-w-5xl">
      <div
        className="card  border-2 w-full p-4 flex flex-col h-[20rem] overflow-auto gap-3 cursor-pointer"
        onClick={() => router.push("/community/" + props?.unique_code)}>
        <div className="flex justify-between">
          <div className="flex gap-2">
            <div className="w-4 h-4 rounded-full bg-red-500"></div>
            <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
            <div className="w-4 h-4 rounded-full bg-green-500"></div>
          </div>
          <h2 className="font-bold">Devsplug</h2>
        </div>
        <SyntaxHighlighter
          language={props.language}
          style={switchStyle(props.style)}
          className="w-full no-scrollbar"
          showLineNumbers>
          {props?.code}
        </SyntaxHighlighter>
      </div>
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="user-infos flex gap-1 items-center">
          <Avatar>
            <AvatarImage
              src={
                props?.user?.profile ||
                "https://i.pinimg.com/564x/13/df/f6/13dff65f79f3134edfc8d8e38e350ca8.jpg"
              }
              alt={"@" + props?.user?.username}
            />
            <AvatarFallback>
              {props?.user?.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <h3
            className="text-xs font-semibold"
            style={{ color: getTitleAttribute(props?.user?.title, 0) }}>
            {props?.user?.username}
          </h3>
        </div>
        <div className="actions flex gap-2">
          <Suspense fallback={<Skeleton className="w-22" />}>
            <ActionButton
              variant="outline"
              className="rounded-lg"
              isLoading={likeAdding}
              onclick={async () => await addLike()}>
              {likes?.number == 0 ? null : likes?.number}
              <ArrowBigUp />
            </ActionButton>
            <ActionButton
              variant="ghost"
              className="rounded-lg"
              isLoading={disLikeAdding}
              onclick={async () => await disLike()}>
              {dislikes?.number == 0 ? null : dislikes?.number}
              <ArrowBigDown />
            </ActionButton>
            <Link
              scroll={true}
              href={"/community/" + props?.unique_code + "/#solution-comments"}>
              <ActionButton variant="ghost" className="rounded-lg">
                {comments?.number == 0 ? null : comments?.number}
                <MessageSquareMore />
              </ActionButton>
            </Link>
          </Suspense>
        </div>
      </div>
      {props?.parts && (
        <h3 className="">
          +{props?.parts?.length} <i>other function(s)</i>
        </h3>
      )}
      <div className="flex items-center justify-between">
        <p className="text-sm truncate">
          {props?.description ? props.description : "user did not add context."}
        </p>
      </div>
      <div className="flex items-center justify-between">
        <h5 className="font-bold text-xs">{props?.problem_item?.title}</h5>
      </div>
    </div>
  );
};
