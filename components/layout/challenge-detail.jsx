"use client";
import { Button } from "../ui/button";
import RateChallenge from "../pages/challenge/rating";

export default function ChallengeDetail({ problem }) {
  const content = problem?.content;

  return (
    <div className="flex px-12 my-24 items-center justify-center flex-col gap-24">
      <div className="flex gap-12  w-full max-w-6xl">
        <Button variant="secondary" className="w-full border-4">
          Challenge Details
        </Button>
        <Button className="w-full">Submit my answer</Button>
      </div>
      <div className="flex gap-12  w-full max-w-6xl flex-col">
        <h1 className="text-4xl font-bold p-6 text-center border-dashed   border-4">
          {problem?.title}
        </h1>
        <div
          className="!w-full min-w-[100%] prose   prose-slate dark:prose-invert"
          style={{ margin: 0 }}
          dangerouslySetInnerHTML={{ __html: content }}
        ></div>
      </div>
      <RateChallenge />
    </div>
  );
}
