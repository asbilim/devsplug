import { Challenge } from "@/app/actions/challenges";
import { SolutionGroup, Solution } from "@/app/types/solutions";
import { getFeaturedSolutions, getPublicSolutionGroups } from "./solutions";

interface HomeData {
  featuredChallenges: Challenge[];
  featuredSolutions: Solution[];
  solutionGroups: SolutionGroup[];
  stats: {
    totalChallenges: number;
    totalUsers: number;
    totalSolutions: number;
    totalLanguages: number;
  };
}

/**
 * Fetch featured challenges for the homepage
 * @param limit Number of challenges to fetch
 * @returns Array of featured challenges
 */
export async function getFeaturedChallenges(limit = 6): Promise<Challenge[]> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/challenges/listings/featured/?limit=${limit}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch featured challenges");
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching featured challenges:", error);
    return [];
  }
}

/**
 * Fetch site stats for the homepage
 * @returns Site statistics
 */
export async function getSiteStats(): Promise<{
  totalChallenges: number;
  totalUsers: number;
  totalSolutions: number;
  totalLanguages: number;
}> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/stats/`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch site stats");
    }

    const data = await response.json();
    return {
      totalChallenges: data.total_challenges || 0,
      totalUsers: data.total_users || 0,
      totalSolutions: data.total_solutions || 0,
      totalLanguages: data.total_languages || 0,
    };
  } catch (error) {
    console.error("Error fetching site stats:", error);
    return {
      totalChallenges: 0,
      totalUsers: 0,
      totalSolutions: 0,
      totalLanguages: 0,
    };
  }
}

/**
 * Fetch all data needed for the homepage
 * @returns Combined data for the homepage
 */
export async function getHomePageData(): Promise<HomeData> {
  const [featuredChallenges, featuredSolutions, solutionGroups, stats] =
    await Promise.all([
      getFeaturedChallenges(6),
      getFeaturedSolutions(3),
      getPublicSolutionGroups(),
      getSiteStats(),
    ]);

  return {
    featuredChallenges,
    featuredSolutions,
    solutionGroups,
    stats,
  };
}
