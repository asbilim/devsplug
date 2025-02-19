"use server";

import { unstable_cache } from "next/cache";

export interface Challenge {
  id: number;
  title: string;
  slug: string;
  description: string;
  difficulty: string;
  points: number;
  estimated_time: number;
  category: {
    id: number;
    name: string;
    icon: string;
    slug: string;
  };
  tags: string[];
  completion_rate: number;
  user_status: string | null;
}

interface GetChallengesOptions {
  page?: number;
  difficulty?: string;
  category?: string;
  search?: string;
  tags?: string[];
}

interface ChallengesResponse {
  data: Challenge[];
  totalPages: number;
  currentPage: number;
}

const ITEMS_PER_PAGE = 9;

export const getChallenges = async ({
  page = 1,
  difficulty,
  category,
  search,
  tags,
}: GetChallengesOptions = {}): Promise<ChallengesResponse> => {
  try {
    const params = new URLSearchParams({
      ...(difficulty && { difficulty }),
      ...(category && { category }),
      ...(search && { search }),
      ...(tags?.length && { tags: tags.join(",") }),
      page: String(page),
      per_page: String(ITEMS_PER_PAGE),
    });

    console.log(
      "Fetching challenges from:",
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/challenges/listings/?${params}`
    );

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/challenges/listings/?${params}`,
      {
        cache: "no-cache",
        next: { tags: ["challenges"] },
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      console.error("API Error:", {
        status: res.status,
        statusText: res.statusText,
        error: errorText,
        url: res.url,
      });
      throw new Error("Failed to fetch challenges");
    }

    const data = await res.json();
    console.log("API Response:", data);

    // Calculate total pages based on count and items per page
    const totalPages = Math.ceil(data.count / ITEMS_PER_PAGE);

    return {
      data: data.results || [], // Changed from data.data to data.results
      totalPages,
      currentPage: page,
    };
  } catch (error) {
    console.error("Error fetching challenges:", error);
    return {
      data: [],
      totalPages: 1,
      currentPage: Number(page),
    };
  }
};
