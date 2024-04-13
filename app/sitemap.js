import { getProblems } from "@/data/get-problems";
import { revalidateTag } from "next/cache";

export default async function sitemap() {
  revalidateTag("problems");
  const problems = await getProblems();

  // Static URLs
  const staticUrls = [
    {
      url: "https://devsplug.com/",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
    },
    {
      url: "https://devsplug.com/challenges",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://devsplug.com/leaderboard",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: "https://devsplug.com/auth/register",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
  ];

  // Dynamic URLs from problems
  const dynamicUrls = problems.flatMap((problem) =>
    problem.problems.map((subProblem) => ({
      url: `https://devsplug.com/problems/details/${subProblem.slug}`,
      lastModified: new Date(subProblem.created_at), // Assuming 'created_at' is a date
      changeFrequency: "weekly", // You can adjust this as necessary
      priority: 0.6, // You can adjust this as necessary
    }))
  );

  return [...staticUrls, ...dynamicUrls];
}
