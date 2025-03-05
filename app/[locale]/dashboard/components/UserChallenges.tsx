"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/src/i18n/routing";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getUserChallenges, ChallengeSubscription } from "@/app/services/api";
import { ExternalLink, Clock, Award, BookOpen } from "lucide-react";

export default function UserChallenges() {
  const t = useTranslations("Dashboard");
  const [challenges, setChallenges] = useState<ChallengeSubscription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const data = await getUserChallenges();
        setChallenges(data);
      } catch (error) {
        console.error("Failed to fetch challenges:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChallenges();
  }, []);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-green-500";
      case "medium":
        return "bg-yellow-500";
      case "hard":
        return "bg-red-500";
      default:
        return "bg-blue-500";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "accepted":
        return "bg-green-500";
      case "rejected":
        return "bg-red-500";
      case "pending":
        return "bg-yellow-500";
      default:
        return "bg-blue-500";
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{t("challenges.title")}</CardTitle>
            <CardDescription>{t("challenges.description")}</CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/challenges">
              <BookOpen className="mr-2 h-4 w-4" />
              {t("challenges.browse")}
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : challenges.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Award className="mb-2 h-12 w-12 text-muted-foreground" />
            <p className="mb-4 text-muted-foreground">
              {t("challenges.noChallenges")}
            </p>
            <Button asChild>
              <Link href="/challenges">{t("challenges.browse")}</Link>
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("challenges.name")}</TableHead>
                  <TableHead className="w-[100px]">
                    {t("challenges.difficulty")}
                  </TableHead>
                  <TableHead className="w-[100px]">
                    {t("challenges.status")}
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    {t("challenges.category")}
                  </TableHead>
                  <TableHead className="w-[100px] text-right">
                    {t("challenges.actions")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {challenges.map((subscription) => (
                  <TableRow key={subscription.id}>
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span>{subscription.challenge.title}</span>
                        <span className="hidden text-xs text-muted-foreground md:inline-flex">
                          <Clock className="mr-1 h-3 w-3" />
                          {subscription.challenge.estimated_time}{" "}
                          {t("challenges.minutes")}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`${getDifficultyColor(
                          subscription.challenge.difficulty
                        )} text-white`}>
                        {subscription.challenge.difficulty}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {subscription.solution_status ? (
                        <Badge
                          variant="outline"
                          className={`${getStatusColor(
                            subscription.solution_status.status
                          )} text-white`}>
                          {subscription.solution_status.status}
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="bg-gray-500 text-white">
                          {t("challenges.notAttempted")}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {subscription.challenge.category.name}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        className="h-8 w-8">
                        <Link
                          href={`/challenges/${subscription.challenge.slug}`}>
                          <ExternalLink className="h-4 w-4" />
                          <span className="sr-only">
                            {subscription.solution_status
                              ? t("challenges.viewSolution")
                              : t("challenges.solve")}
                          </span>
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
