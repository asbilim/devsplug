"use client";
import { useState, useEffect, useRef } from "react";

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
import {
  ArrowBigDown,
  ArrowBigUp,
  ClipboardCheck,
  ImageDown,
  MessageSquareMore,
} from "lucide-react";
import { getTitleAttribute } from "@/data/name-icons";
import { useDownloadImage } from "@/providers/download-image";
import { Button } from "@/components/ui/button";
import { copyToClipboard } from "@/providers/clipboard";
import {
  AlertDialogTrigger,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogFooter,
  AlertDialogContent,
  AlertDialog,
} from "@/components/ui/alert-dialog";

import {
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
  Select,
} from "@/components/ui/select";
import { switchStyle } from "@/components/layout/styles";

export const SolutionDetailCard = (props) => {
  const { toast } = useToast();
  const handleCopyClick = async () => {
    try {
      await copyToClipboard(props?.code);
      toast({
        title: "Copied",
        description: (
          <div className="mt-2 w-[340px] rounded-md bg-green-950 p-4">
            <code className="text-green-200 overflow-auto">
              {JSON.stringify(
                {
                  message: "code copied to clipboard",
                },
                null,
                2
              )}
            </code>
          </div>
        ),
      });
    } catch (error) {
      toast({
        title: "Code not copied",
        description: (
          <div className="mt-2 w-[340px] rounded-md bg-red-950 p-4">
            <code className="text-red-200 overflow-auto">
              {JSON.stringify(
                {
                  message: error.message,
                },
                null,
                2
              )}
            </code>
          </div>
        ),
      });
    }
  };
  const imageRef = useRef(null);
  const [scale, setScale] = useState(2);
  const [downloadImage, className] = useDownloadImage({
    ref: imageRef,
    scale: scale,
    user: props?.user,
    unique_id: "devsplug-code",
    normalClass: "border-2",
    captureClass: "w-fit",
  });

  const generateSchreenshot = (scale) => {
    setScale(scale);
    downloadImage();
    setOpen(false);
  };

  const [open, setOpen] = useState(false);

  return (
    <div className="flex  flex-col gap-3 md:max-w-5xl   ">
      <div className={`flex overflow-visible ${className} `}>
        <div
          className={`card  w-full p-4 flex flex-col  overflow-visible gap-3   `}
          ref={imageRef}>
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
            className="w-full no-scrollbar p-4 "
            showLineNumbers>
            {props?.code}
          </SyntaxHighlighter>
        </div>
      </div>
      <div className="flex gap-2">
        <AlertDialog open={open}>
          <AlertDialogTrigger asChild>
            <Button variant="ghost">
              <ImageDown onClick={() => setOpen(true)} />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Select the quality for the image
              </AlertDialogTitle>
              <AlertDialogDescription>
                Note that a too high quality on certain device can alter the
                image to txt file , so please choose a convenable quality
                according to your device
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="grid gap-4">
              <Select onValueChange={(value) => setScale(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue defaultValue={"2"} placeholder="Image quality" />
                </SelectTrigger>

                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20].map((item) => {
                    return (
                      <div key={item + ""}>
                        <SelectItem value={item + ""}>{item}</SelectItem>
                      </div>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            <AlertDialogFooter>
              <AlertDialogAction>
                <Button onClick={() => generateSchreenshot(scale)}>
                  Generate
                </Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Button variant="ghost" onClick={handleCopyClick}>
          <ClipboardCheck />
        </Button>
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
