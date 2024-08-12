"use client";
import React, { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { LuBadgePlus, LuBadgeMinus, LuSearch, LuTag } from "react-icons/lu";
import { MessageSquareWarning, SlidersHorizontal } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

import { addProblem } from "@/data/add-problem";

const ChallengeComponent = ({ problems }) => {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProblems, setFilteredProblems] = useState(problems);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const { data: session, update } = useSession();
  const router = useRouter();

  useEffect(() => {
    let filtered = problems.filter(
      (problem) =>
        problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        problem.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        problem?.tags?.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    if (selectedFilter !== "all") {
      filtered = filtered.filter((problem) =>
        problem?.tags?.includes(selectedFilter)
      );
    }

    setFilteredProblems(filtered);
  }, [searchTerm, problems, selectedFilter]);

  const enrollProblem = async (problemID, removing = false) => {
    if (!session) {
      return signIn("credentials", { redirect: "/dashboard" });
    }
    const accessToken = session.accessToken;
    setLoading(true);
    await addProblem({ problem_id: problemID }, accessToken);

    toast(removing ? "Problem removed" : "Problem Added", {
      description: removing
        ? "The challenge was removed from your dashboard."
        : "The challenge was added to your dashboard.",
      action: {
        label: removing ? "Done" : "Go to dashboard",
        onClick: () => !removing && router.push("/dashboard"),
      },
    });

    update();
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col mt-24 px-4 md:px-12 items-center justify-center w-full my-24 min-h-screen">
      <FilterComponent
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
      />

      <motion.div
        layout
        className="challenges flex justify-center flex-col my-12 items-start w-full gap-8">
        <motion.h2
          layout
          className="font-semibold border-b-2 border-b-primary py-2 text-start text-3xl">
          Challenges
        </motion.h2>

        <Card className="w-full bg-yellow-50 border-yellow-500">
          <CardContent className="flex items-center p-4">
            <MessageSquareWarning size={40} className="text-yellow-500 mr-4" />
            <p className="text-sm text-yellow-700">
              Sharing challenge solutions or using AI is against our rules and
              detracts from the learning experience. Violators will be
              permanently banned. Please respect the integrity of the
              challenges.
            </p>
          </CardContent>
        </Card>

        <AnimatePresence>
          {filteredProblems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="w-full">
              <ChallengeCard
                item={item}
                session={session}
                enrollProblem={enrollProblem}
                loading={loading}
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredProblems.length === 0 && (
          <EmptyState message="No challenges found matching your criteria." />
        )}
      </motion.div>
    </motion.div>
  );
};

const FilterComponent = ({
  searchTerm,
  setSearchTerm,
  selectedFilter,
  setSelectedFilter,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center w-full max-w-6xl gap-3 mb-8">
      <div className="relative w-full max-w-xl">
        <Input
          className="w-full border-2 pl-10"
          placeholder="Search for challenges, modules or tags..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <LuSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full sm:w-auto">
            <SlidersHorizontal className="mr-2" />
            Filter
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuRadioGroup
            value={selectedFilter}
            onValueChange={setSelectedFilter}>
            <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="beginner">
              Beginner
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="intermediate">
              Intermediate
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="advanced">
              Advanced
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

const ChallengeCard = ({ item, session, enrollProblem, loading }) => {
  const isEnrolled = session?.user?.problems?.find(
    (problem) => problem.id === item.id
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{item.title}</CardTitle>
        <CardDescription>{item.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible>
          <AccordionItem value="content">
            <AccordionTrigger>View Details</AccordionTrigger>
            <AccordionContent>
              <div
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: item.content }}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="flex gap-2">
          {item?.tags?.map((tag, index) => (
            <Badge key={index} variant="secondary">
              <LuTag className="mr-1" />
              {tag}
            </Badge>
          ))}
        </div>
        <Button
          variant={isEnrolled ? "destructive" : "default"}
          onClick={() => enrollProblem(item.id, isEnrolled)}
          disabled={loading}>
          {isEnrolled ? (
            <>
              <LuBadgeMinus className="mr-2" />
              Unenroll
            </>
          ) : (
            <>
              <LuBadgePlus className="mr-2" />
              Enroll
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

const EmptyState = ({ message }) => (
  <div className="w-full text-center py-12">
    <p className="text-gray-500">{message}</p>
  </div>
);

export default ChallengeComponent;
