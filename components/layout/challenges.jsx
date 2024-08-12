"use client"
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Search, Filter, Tag, Clock, Award } from "lucide-react";

import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ChallengesPage = ({ challenges }) => {
  const [filteredChallenges, setFilteredChallenges] = useState(challenges);
  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const { data: session } = useSession();

  useEffect(() => {
    const filtered = challenges.filter(challenge => 
      challenge.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (difficultyFilter === "all" || challenge.level === difficultyFilter)
    );
    setFilteredChallenges(filtered);
  }, [searchTerm, difficultyFilter, challenges]);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="flex flex-col min-h-screen"
    >
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <motion.h1 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-3xl font-bold mb-8"
        >
          Explore Challenges
        </motion.h1>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              className="pl-10"
              placeholder="Search challenges..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <AnimatePresence>
          <motion.div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredChallenges.map((challenge, index) => (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <ChallengeCard challenge={challenge} session={session} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {filteredChallenges.length === 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-500 mt-8"
          >
            No challenges found matching your criteria.
          </motion.p>
        )}
      </main>

      <Footer />
    </motion.div>
  );
};

const ChallengeCard = ({ challenge, session }) => {
  const isEnrolled = session?.user?.problems?.some(p => p.id === challenge.id);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>{challenge.title}</CardTitle>
        <CardDescription>{challenge.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex items-center gap-2 mb-2">
          <Tag className="h-4 w-4" />
          <Badge variant="secondary">{challenge.level}</Badge>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <Clock className="h-4 w-4" />
          <span className="text-sm">Created: {new Date(challenge.created_at).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-2">
          <Award className="h-4 w-4" />
          <span className="text-sm">{challenge.points} points</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" variant={isEnrolled ? "secondary" : "default"}>
          <Link href={`/problems/details/${challenge.slug}`}>
            {isEnrolled ? "Continue Challenge" : "Start Challenge"}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ChallengesPage;