"use client";
import { getTitleAttribute } from "@/data/name-icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SolutionDetailCard } from "./cards";
import { useState, useEffect } from "react";
import { formatDistanceToNow, parseISO } from "date-fns";
export default function SolutionDetail(props) {
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");

  const onclick = (data) => {
    setCode(data?.code);
    setDescription(data?.description);
  };

  useEffect(() => {
    onclick(props);
  }, [props]);

  return (
    <div className="flex w-full items-center flex-col min-h-screen  pt-36 px-4">
      <div className="flex max-w-6xl flex-col w-full gap-12">
        <h1 className="font-extrabold md:text-xl text-lg lg:text-3xl">
          {props?.problem_item?.title}
        </h1>
        <div className="user-infos flex gap-1  justify-center items-start flex-col">
          <div className="flex  items-center justify-center gap-1">
            <Avatar>
              <AvatarImage
                src={props?.user?.profile || "https://github.com/shadcn.png"}
                alt={"@" + props?.user?.username}
              />
              <AvatarFallback>
                {props?.user?.username.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <h3
              className="font-semibold"
              style={{ color: getTitleAttribute(props?.user?.title, 0) }}>
              {props?.user?.username}
            </h3>
          </div>
          {props?.created_at && (
            <p>
              written{" "}
              {formatDistanceToNow(parseISO(props?.created_at), {
                addSuffix: true,
              })}
            </p>
          )}
        </div>
        <div className="content flex  w-full justify-center  md:px-0 mb-24">
          <div className="md:grid flex flex-col md:grid-cols-6 gap-6 w-full max-w-6xl gap-y-16 grid-rows-1">
            <div className="md:col-span-5 col-span-6 flex-col gap-12 flex w-full">
              <SolutionDetailCard {...props} code={code} />
              <p>{description || "user did not add context."}</p>
            </div>
            <p className="md:hidden underline">select a function to inspect</p>
            <div className="grid gap-3 grid-cols-3 md:grid-cols-1">
              <div
                className="card w-full p-4 flex flex-col md:h-[7rem] min-h-[5rem] lg:h-[10rem] overflow-auto gap-3 cursor-pointer  bg-muted text-sm items-center justify-center text-center border-4"
                onClick={() => onclick(props)}>
                {props?.name}
              </div>
              {props?.parts?.map((item, index) => {
                const isActive = item.code === code;
                return (
                  <div
                    className={`card w-full p-4 flex flex-col md:h-[7rem] min-h-[5rem] lg:h-[10rem] overflow-auto gap-3 cursor-pointer  bg-muted text-sm items-center justify-center text-center transition-colors   ${`${
                      isActive ? "border-2" : ""
                    }`}`}
                    key={index + ""}
                    onClick={() => onclick(item)}>
                    {item.name}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
