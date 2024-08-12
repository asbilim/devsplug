"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  ChevronDown,
  Award,
  Target,
  Zap,
  Book,
  Star,
  Clock,
} from "lucide-react";

import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

const Dashboard = () => {
  const { data: session } = useSession();
  const problems = session?.user?.problems || [];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}>
          <h1 className="text-4xl font-bold text-center">
            Welcome back, {session?.user?.name}!
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            icon={<Award />}
            title="Total Points"
            value={session?.user?.score}
          />
          <StatCard
            icon={<Target />}
            title="Challenges Completed"
            value={`${countCompletedChallenges(problems)}/${problems.length}`}
          />
          <StatCard
            icon={<Zap />}
            title="Overall Progress"
            value={
              <Progress
                value={
                  (countCompletedChallenges(problems) / problems.length) * 100
                }
                className="mt-2"
              />
            }
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Book className="h-6 w-6" />
              <span>Your Learning Journey</span>
            </CardTitle>
            <CardDescription>
              Explore your ongoing challenges and track your progress
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px] pr-4">
              <AccordionChallenges problems={problems} />
            </ScrollArea>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button asChild size="lg">
            <Link href="/challenges">Explore More Challenges</Link>
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

const StatCard = ({ icon, title, value }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {React.cloneElement(icon, { className: "h-4 w-4" })}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
  </Card>
);

const AccordionChallenges = ({ problems }) => {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="space-y-4">
      {problems.map((problem, index) => (
        <AccordionItem
          key={problem.slug}
          problem={problem}
          isOpen={openIndex === index}
          onToggle={() => setOpenIndex(openIndex === index ? null : index)}
        />
      ))}
    </div>
  );
};

const AccordionItem = ({ problem, isOpen, onToggle }) => {
  const completedProblems = problem.problems.filter(
    (item) => item.completed
  ).length;
  const totalProblems = problem.problems.length;
  const progress = (completedProblems / totalProblems) * 100;

  return (
    <Card>
      <motion.div layout>
        <CardHeader className="cursor-pointer" onClick={onToggle}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
            <CardTitle className="flex items-center space-x-2">
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}>
                <ChevronDown className="h-5 w-5" />
              </motion.div>
              <span>{problem.title}</span>
            </CardTitle>
            <div className="flex items-center space-x-4 w-full sm:w-auto">
              <Progress value={progress} className="w-full sm:w-24" />
              <span className="text-sm font-medium whitespace-nowrap">
                {completedProblems}/{totalProblems}
              </span>
            </div>
          </div>
        </CardHeader>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}>
              <CardContent className="pt-0">
                <p className="mb-4">{problem.description}</p>
                <div className="space-y-3">
                  {problem.problems.map((item, itemIndex) => (
                    <Link
                      href={`/problems/details/${item.slug}`}
                      key={item.slug}
                      className="block">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="border rounded-lg shadow-sm p-3 transition-all hover:shadow-md flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`text-2xl font-bold ${
                              item.completed ? "text-green-500" : ""
                            } w-8 text-center`}>
                            {itemIndex + 1}
                          </div>
                          <div>
                            <div className="font-medium">{item.title}</div>
                            <Badge
                              variant={item.completed ? "secondary" : "outline"}
                              className="mt-1">
                              {item.level}
                            </Badge>
                          </div>
                        </div>
                        <ChevronDown className="h-5 w-5" />
                      </motion.div>
                    </Link>
                  ))}
                </div>
                <Separator className="my-4" />
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="font-medium">
                        {problem.points} points
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">
                        Updated:{" "}
                        {new Date(problem.updated_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <Button asChild>
                    <Link href={`/problems/details/${problem.slug}`}>
                      View Challenge
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </Card>
  );
};

const calculateTotalPoints = (problems) =>
  problems.reduce((total, problem) => total + problem.points, 0);

const countCompletedChallenges = (problems) =>
  problems.filter((problem) => problem.completed).length;

export default Dashboard;
