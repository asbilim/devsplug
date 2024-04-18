"use client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import SyntaxHighlighter from "react-syntax-highlighter";
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
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import supportedLanguages from "react-syntax-highlighter/dist/cjs/languages/hljs/supported-languages";
import {
  ArrowBigUp,
  ArrowBigDown,
  MessageSquareMore,
  RotateCw,
} from "lucide-react";
import ActionButton from "@/components/buttons/action-button";
import { GiReloadGunBarrel } from "react-icons/gi";
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

export default function CommunityContent({ solutions }) {
  return (
    <div className="flex flex-col w-full px-4 md:px-12 min-h-screen py-24  items-center ">
      <Filters />
      <RenderSolutions solutions={solutions} />
    </div>
  );
}

const Filters = () => {
  return (
    <div className="flex max-w-6xl w-full justify-between flex-wrap gap-4 pt-12">
      <h1 className="text-2xl font-bold">
        {"Challenges'solutions"} from {"devsplug's"} users
      </h1>
      <div className="flex gap-4 flex-wrap">
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by problem" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Fruits</SelectLabel>
              <SelectItem value="apple">Apple</SelectItem>
              <SelectItem value="banana">Banana</SelectItem>
              <SelectItem value="blueberry">Blueberry</SelectItem>
              <SelectItem value="grapes">Grapes</SelectItem>
              <SelectItem value="pineapple">Pineapple</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="filter by language" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Fruits</SelectLabel>
              <SelectItem value="apple">Apple</SelectItem>
              <SelectItem value="banana">Banana</SelectItem>
              <SelectItem value="blueberry">Blueberry</SelectItem>
              <SelectItem value="grapes">Grapes</SelectItem>
              <SelectItem value="pineapple">Pineapple</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

const RenderSolutions = ({ solutions }) => {
  const router = useRouter();
  return (
    <div className="flex flex-col">
      <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6 w-full max-w-6xl mt-12 gap-y-16">
        {solutions?.map((item, index) => {
          return <SolutionCard key={index + ""} {...item} />;
        })}
      </div>
      <div className="flex my-24">
        <ActionButton variant="">
          Load More <RotateCw className="mx-2" />
        </ActionButton>
      </div>
    </div>
  );
};


const SolutionCard = (props) => {

  const router = useRouter()

  const code = props?.unique_code || "error"

  return (
    <div className="flex  flex-col gap-3 max-w-[22rem] md:max-w-5xl">
      <div className="card  border-2 w-full p-4 flex flex-col h-[20rem] overflow-auto gap-3 cursor-pointer" onClick={()=>router.push("/community/"+code,{target:"_blank"})} >
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
          showLineNumbers
        >
          {props?.code}
        </SyntaxHighlighter>
      </div>
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="user-infos flex gap-1 items-center">
          <Avatar>
            <AvatarImage
              src={props?.user?.profile || "https://github.com/shadcn.png"}
              alt={"@" + props?.user?.username}
            />
            <AvatarFallback>
              {props?.user?.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <h3 className="text-xs font-semibold">{props?.user?.username}</h3>
        </div>
        <div className="actions flex gap-2">
          <ActionButton variant="outline" className="rounded-lg">
            14
            <ArrowBigUp />
          </ActionButton>
          <ActionButton variant="ghost" className="rounded-lg">
            14
            <ArrowBigDown />
          </ActionButton>
          <ActionButton variant="ghost" className="rounded-lg">
            9+
            <MessageSquareMore />
          </ActionButton>
        </div>
      </div>
      {props?.parts && (
        <h3 className="">
          +{props?.parts?.length} <i>other function(s)</i>
        </h3>
      )}
      <div className="flex items-center justify-between">
        <p className="text-sm truncate">{props?.name}</p>
      </div>
      <div className="flex items-center justify-between">
        <h5 className="font-bold text-xs">{props?.problem_item?.title}</h5>
      </div>
    </div>
  );
};
