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
    <div className="flex flex-col mt-24 px-4 md:px-12 items-center justify-center w-full my-24">
      <FilterComponent />
      <div className="challenges flex justify-center flex-col my-12 mt-24 items-start  w-full max-w-6xl gap-12">
        <h2 className="font-medium text-start text-xl">Challenges</h2>
        {problems.map((item, index) => {
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
      <AccordionContent className="tracking-wider text-center md:text-md leading-loose text-xs">
        {description}
      </AccordionContent>
    </AccordionItem>
  );
};
