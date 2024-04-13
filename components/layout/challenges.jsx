"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { EmptyState } from "../pages/states/empty";
export function AccordionChallenge() {
  const { data: session } = useSession();
  const hasProblems = session?.user?.problems || false;
  const problems = hasProblems ? session.user?.problems : [];

  return (
    <div className="flex w-full items-center justify-center  flex-col gap-12 my-24  px-12 lg:px-0">
      <Accordion
        type="single"
        collapsible
        className="w-full max-w-lg md:max-w-6xl"
      >
        {hasProblems &&
          problems.map((problem, item) => {
            return (
              <SingleProblem
                title={problem.title}
                problemsItems={problem.problems}
                key={problem.slug}
              />
            );
          })}

        {!problems.length && (
          <EmptyState message="You did not add any challenge " />
        )}
      </Accordion>
    </div>
  );
}

const SingleProblem = ({ title = "", problemsItems = [] }) => {
  return (
    <AccordionItem value={title} className="py-8">
      <AccordionTrigger className="text-sm tracking-tight md:text-lg">
        {title}
      </AccordionTrigger>
      <AccordionContent>
        <div className="grid grid-cols-5 py-12 gap-4 md:gap-12">
          {problemsItems.map((digit, index) => {
            console.log(digit.level);
            return (
              <Link
                href={"/problems/details/" + digit.slug}
                key={digit.slug + ""}
              >
                <Square index={index} level={digit.level} />
              </Link>
            );
          })}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export const Square = ({ index, level }) => {
  function getClassName(level) {
    switch (level) {
      case "hard":
        return "bg-zinc-950 text-white dark:bg-red-900";
      case "medium":
        return "bg-neutral-600 text-white dar:bg-zinc-300";
      default:
        return "bg-slate-600 text-white dark:bg-slate-200 dark:text-zinc-700";
    }
  }

  const color = getClassName(level);

  return (
    <div
      className={
        "square aspect-square  md:w-20 md:h-20 w-8 h-8  flex items-center justify-center font-semibold " +
        color
      }
    >
      {index + 1}
    </div>
  );
};
