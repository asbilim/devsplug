"use client";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { SlidersHorizontal } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ActionButton from "../buttons/action-button";
import { useSession, signIn } from "next-auth/react";
import { addProblem } from "@/data/add-problem";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { LuBadgePlus, LuBadgeMinus } from "react-icons/lu";
import { MessageSquareWarning } from "lucide-react";
import { EmptyState } from "./states/empty";
export default function ChallengeComponent({ problems }) {
  const [loading, setLoading] = useState(false);
  const { data: session, update } = useSession();

  const router = useRouter();
  const enrollProblem = async (problemID, removing = false) => {
    if (!session) {
      return signIn("credentials", { redirect: "/dashboard" });
    }
    const accessToken = session.accessToken;
    setLoading(true);
    const add = await addProblem({ problem_id: problemID }, accessToken);
    if (removing) {
      toast("Problem removed", {
        description: "The challenge was removed from your dashboard.",
        action: {
          label: "Done",
          type: "success",
        },
      });
    } else {
      toast("Problem Added", {
        description: "The challenge was added to your dashboard.",
        action: {
          label: "Go to dashboard",
          onClick: () => router.push("/dashboard", "_blank"),
          type: "success",
        },
      });
    }

    update();
    setLoading(false);
  };

  return (
    <div className="flex flex-col mt-24 px-4 md:px-12 items-center justify-center w-full my-24 min-h-screen">
      <FilterComponent />
      <div className="challenges flex justify-center flex-col my-12 mt-24 items-start  w-full max-w-6xl gap-12">
        <h2 className="font-semibold border-b-2 border-b-primary py-2 text-start text-3xl">
          Challenges
        </h2>
        <div className="flex w-full flex-col p-4 border-2 border-yellow-500 items-center gap-1 md:flex-row">
          <MessageSquareWarning size={50} className="mx-4 min-w-20" />
          <span ca>
            Sharing challenge solutions or using AI is against our rules and
            detracts from the learning experience. Violators will be permanently
            banned. Please respect the integrity of the challenges.
          </span>
        </div>
        {problems?.map((item, index) => {
          return (
            <>
              <div className="challenge flex gap-12 w-full justify-between items-center ">
                <Accordion type="single" collapsible className="w-full">
                  <SingleChallenge
                    title={item.title}
                    description={item.description}
                  />
                </Accordion>
                <ActionButton
                  variant="outline"
                  className="border-0 hover:bg-transparent"
                  isLoading={loading}
                >
                  {session?.user?.problems?.find(
                    (element) => element.id == item.id
                  ) ? (
                    <LuBadgeMinus
                      className="md:text-4xl lg:text-5xl text-2xl"
                      color="red"
                      onClick={() => enrollProblem(item.id, true)}
                    />
                  ) : (
                    <LuBadgePlus
                      className="md:text-4xl text-2xl lg:text-5xl"
                      onClick={() => enrollProblem(item.id, false)}
                    />
                  )}
                </ActionButton>
              </div>
            </>
          );
        })}
        {!problems?.length && (
          <EmptyState message="we faced some difficulties showing challenges" />
        )}
      </div>
    </div>
  );
}

const FilterComponent = () => {
  return (
    <div className="flex  items-center justify-center w-full max-w-6xl  gap-3">
      <Input
        className="w-full max-w-xl border-2 "
        placeholder="Search for challenges , modules or anything...."
      />
      <Button variant="outline">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SlidersHorizontal />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="">
            <DropdownMenuRadioGroup>
              <DropdownMenuRadioItem value="top">
                <p>hey</p>
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="bottom">
                <p>hey</p>
              </DropdownMenuRadioItem>
              <DropdownMenuSeparator />
              <DropdownMenuRadioItem value="right">
                <p>hey</p>
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </Button>
      <Button>Apply</Button>
    </div>
  );
};

const SingleChallenge = ({ title = "", description = "" }) => {
  return (
    <AccordionItem value={title} className="py-8">
      <AccordionTrigger className="text-sm tracking-tight md:text-lg ">
        {title}
      </AccordionTrigger>
      <AccordionContent className="tracking-wider md:text-start text-center md:text-md leading-loose text-xs">
        {description}
      </AccordionContent>
    </AccordionItem>
  );
};
