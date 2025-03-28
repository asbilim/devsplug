import {
  Solution,
  SolutionGroup,
  GetSolutionsOptions,
} from "@/app/types/solutions";

/**
 * Fetch public solutions grouped by challenge
 * @returns Array of solution groups by challenge
 */
export async function getPublicSolutionGroups(): Promise<SolutionGroup[]> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/challenges/solutions/public/`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch solutions");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching public solution groups:", error);
    return [];
  }
}

/**
 * Fetch featured solutions
 * @param limit Maximum number of solutions to fetch
 * @returns Array of featured solutions
 */
export async function getFeaturedSolutions(limit = 3): Promise<Solution[]> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/challenges/solutions/featured/`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch featured solutions");
    }

    const data = await response.json();
    if (Array.isArray(data)) {
      return data.slice(0, limit);
    }
    return [];
  } catch (error) {
    console.error("Error fetching featured solutions:", error);
    return [];
  }
}

/**
 * Fetch solutions for a specific challenge
 * @param slug Challenge slug
 * @param options Fetch options
 * @returns Solutions and pagination information
 */
export async function getChallengeSolutions(
  slug: string,
  options: GetSolutionsOptions = {}
): Promise<{
  solutions: Solution[];
  total: number;
  totalPages: number;
}> {
  try {
    const { page = 1, language, sort = "newest" } = options;

    // Build the URL with proper query parameters
    let url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/challenges/listings/${slug}/solutions/`;

    // If we have query parameters, add them properly
    const queryParams = new URLSearchParams();

    if (language && language !== "all") {
      queryParams.append("language", language);
    }

    if (sort) {
      queryParams.append("sort", sort);
    }

    // Add the query string if we have parameters
    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }

    const response = await fetch(url, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch challenge solutions");
    }

    const data = await response.json();

    // Check if response is an array or has a solutions property
    if (Array.isArray(data)) {
      // API returned an array directly
      return {
        solutions: data,
        total: data.length,
        totalPages: 1,
      };
    } else {
      // API returned an object with solutions property
      return {
        solutions: data.solutions || [],
        total: data.total || data.solutions?.length || 0,
        totalPages: data.total_pages || 1,
      };
    }
  } catch (error) {
    console.error(`Error fetching solutions for challenge ${slug}:`, error);
    return {
      solutions: [],
      total: 0,
      totalPages: 1,
    };
  }
}

/**
 * Fetch a specific solution by ID
 * @param slug Challenge slug
 * @param id Solution ID
 * @returns Solution data
 */
export async function getSolution(
  slug: string,
  id: string | number
): Promise<Solution | null> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/challenges/listings/${slug}/solutions/${id}/`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch solution");
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching solution ${id}:`, error);
    return null;
  }
}

/**
 * Like a solution
 * @param slug Challenge slug
 * @param id Solution ID
 * @returns Success status
 */
export async function likeSolution(
  slug: string,
  id: string | number
): Promise<boolean> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/challenges/listings/${slug}/solutions/${id}/like/`,
      {
        method: "POST",
        credentials: "include",
      }
    );

    return response.ok;
  } catch (error) {
    console.error(`Error liking solution ${id}:`, error);
    return false;
  }
}
