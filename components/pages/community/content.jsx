
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Suspense } from "react";

import { revalidateTag } from "next/cache";

import supportedLanguages from "react-syntax-highlighter/dist/cjs/languages/hljs/supported-languages";

import { SolutionCard } from "./codecard";
import {

  RotateCw,
} from "lucide-react";
import ActionButton from "@/components/buttons/action-button";


export default function CommunityContent({ solutions }) {
  revalidateTag("comments");
  revalidateTag("likes");
  revalidateTag("dislikes");
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
 
  return (
    <div className="flex flex-col">
      <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6 w-full max-w-6xl mt-12 gap-y-16">
        {solutions?.map((item, index) => {
          return <Suspense key={index + ""} loading={<p>loading ...</p>}>
            <SolutionCard  {...item} />
          </Suspense>
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


