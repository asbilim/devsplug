"use client";
import { Button } from "../ui/button";
import RateChallenge from "../pages/challenge/rating";
import Link from "next/link";
import { EmptyState } from "../pages/states/empty";
export default function ChallengeDetail({ problem, ratings, slug }) {
  const content = problem?.content;

  return (
    <div className="flex px-12 my-24 items-center justify-center flex-col gap-24 overflow-hidden">
      <div className="flex md:gap-12 gap-2  md:w-full max-w-sm  md:max-w-6xl">
        <Button variant="secondary" className="w-full border-4">
          Challenge Details
        </Button>
        <Button className="w-full">
          <Link href={`/problems/solve/${problem?.slug}`} target="_blank">
            Submit my answer
          </Link>
        </Button>
      </div>
      <div className="flex gap-12  w-full max-w-6xl flex-col">
        <h1 className="md:text-4xl font-bold p-6 text-center border-dashed   border-4">
          {problem?.title}
        </h1>
        <div
          className="!w-full min-w-[100%] prose prose-sm md:prose-md lg:prose-lg  prose-slate dark:prose-invert"
          style={{ margin: 0 }}
          dangerouslySetInnerHTML={{ __html: content }}
        ></div>
        {!content && (
          <EmptyState message="we are currently having a problem fetching this challenge, make sure it exists or recheck the url" />
        )}
      </div>
      <RateChallenge initialRatings={ratings} slug={slug} />
    </div>
  );
}
