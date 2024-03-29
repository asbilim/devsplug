import Header from "@/components/layout/header";
import Motivation from "@/components/layout/motivation";
import ChallengeLegend from "@/components/layout/challenge-legend";
import { AccordionChallenge } from "@/components/layout/challenges";
import { CirclePlus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  return (
    <div className="flex flex-col">
      <Header />
      <Motivation />
      <ChallengeLegend />
      <AccordionChallenge />
      <div className="flex items-center justify-center">
        <div className="flex w-full max-w-6xl mb-24 px-12 lg:px-0">
          <Button className="px-24 py-6">
            <CirclePlus className="mr-2 h-4 w-4" />
            Add more
          </Button>
        </div>
      </div>
    </div>
  );
}
