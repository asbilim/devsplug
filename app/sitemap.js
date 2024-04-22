import { getProblems, getSolutions } from "@/data/get-problems";
import { revalidateTag } from "next/cache";
import { getLeaderBoard } from "@/data/get-score";
export default async function sitemap() {
  revalidateTag("problems");
  revalidateTag("leaderboard");
  const problems = await getProblems();
  const users = await getLeaderBoard();
  const solutions = await getSolutions();

  // Static URLs
  const staticUrls = [
    {
      url: "https://www.devsplug.com/",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
    },
    {
      url: "https://www.devsplug.com/challenges",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://www.devsplug.com/leaderboard",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: "https://www.devsplug.com/community",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: "https://www.devsplug.com/auth/register",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
  ];

  const userUrls = users.map((user) => {
    return {
      url: `https://www.devsplug.com/user/${encodeURIComponent(user.username)}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    };
  });

  const solutionsUrls = solutions.map((user) => {
    return {
      url: `https://www.devsplug.com/community/${encodeURIComponent(
        user.unique_code
      )}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    };
  });

  const dynamicUrls = problems.flatMap((problem) =>
    problem.problems.map((subProblem) => ({
      url: `https://www.devsplug.com/problems/details/${subProblem.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    }))
  );

  return [...staticUrls, ...dynamicUrls, ...userUrls, ...solutionsUrls];
}
