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

export const SolutionDetailCard = (props) => {
  return (
    <div className="flex  flex-col gap-3 md:max-w-5xl col-span-5  ">
      <div className="card  border-2 w-full p-4 flex flex-col  overflow-auto gap-3 ">
        <div className="flex justify-between">
          <div className="flex gap-2">
            <div className="w-4 h-4 rounded-full bg-red-500"></div>
            <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
            <div className="w-4 h-4 rounded-full bg-green-500"></div>
          </div>
          <h2 className="font-bold">Devsplug</h2>
          <h2
            className="font-medium"
            style={{ color: getTitleAttribute(props?.user?.title, 0) }}>
            &copy;{props?.user?.username}
          </h2>
        </div>
        <SyntaxHighlighter
          language={props.language}
          style={switchStyle(props.style)}
          className="w-full no-scrollbar"
          showLineNumbers>
          {props?.code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

export const SolutionDetailCardFunction = (props) => {
  return (
    <div className="flex  flex-col gap-3 max-w-[44rem] md:max-w-5xl col-span-5 cursor-pointer   h-full">
      <div className="card  border-2 w-full p-4 flex flex-col  overflow-auto gap-3 h-full ">
        <div className="flex justify-between">
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
    </div>
  );
};
