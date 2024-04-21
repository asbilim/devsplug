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
import { Suspense, useState, useEffect } from "react";
import ChallengeLoading from "../states/challenge-loading";
import { revalidateTag } from "next/cache";

import supportedLanguages from "react-syntax-highlighter/dist/cjs/languages/hljs/supported-languages";

import { SolutionCard } from "./codecard";
import { RotateCw } from "lucide-react";
import ActionButton from "@/components/buttons/action-button";

export default function CommunityContent({ solutions }) {
  const titles = [...new Set(solutions.map((item) => item.problem_item.title))];
  const [datas, setDatas] = useState(false);

  const applyFilter = (value) => {
    if (value == "all") {
      setDatas(solutions);
      return true;
    }
    const newArray = solutions.filter(
      (item) =>
        item.problem_item.title.replaceAll(" ", "").toLowerCase() ==
        value.replaceAll(" ", "").toLowerCase()
    );

    setDatas(newArray);
  };

  const applyLanguage = (value) => {
    if (value == "all") {
      setDatas(solutions);
      return true;
    }
    const newArray = solutions.filter(
      (item) => item.language.toLowerCase() == value.toLowerCase()
    );

    setDatas(newArray);
  };

  useEffect(() => {
    setDatas(solutions);
  }, [solutions]);

  return (
    <div className="flex flex-col w-full px-4 md:px-12 min-h-screen py-24  items-center ">
      <Filters
        titles={titles}
        applyFilter={applyFilter}
        applyLanguage={applyLanguage}
      />
      {datas && <RenderSolutions solutions={datas} />}
    </div>
  );
}

const Filters = ({ titles, applyFilter, applyLanguage }) => {
  return (
    <div className="flex max-w-6xl w-full justify-between flex-wrap gap-4 pt-12">
      <h1 className="text-2xl font-bold">
        {"Challenges'solutions"} from {"devsplug's"} users
      </h1>
      <div className="flex gap-4 flex-wrap">
        <Select
          onValueChange={(value) => {
            applyFilter(value);
          }}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by problem" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Titles</SelectLabel>
              <SelectItem value="all">All</SelectItem>
              {titles?.map((title, index) => {
                return (
                  <div key={index + ""}>
                    <SelectItem value={title}>{title}</SelectItem>
                  </div>
                );
              })}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select onValueChange={(value) => applyLanguage(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="filter by language" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Language</SelectLabel>
              <SelectItem value="all">All</SelectItem>
              {supportedLanguages?.map((title, index) => {
                return (
                  <div key={index + ""}>
                    <SelectItem value={title}>{title}</SelectItem>
                  </div>
                );
              })}
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
          return (
            <Suspense key={index + ""} loading={<p>loading ...</p>}>
              <SolutionCard {...item} />
            </Suspense>
          );
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
