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
  is_subscribed?: boolean;
  subscription_status?: {
    is_subscribed: boolean;
    attempts_count: number;
    max_attempts: number | null;
  };
  content: string;
  attachments?: Array<{
    id: number;
    title: string;
    file: string;
  }>;
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

export async function subscribeToChallenge(slug: string, accessToken: string) {
  console.log("🎯 Challenge Subscribe: Starting subscription", { slug });

  try {
    console.log("📡 Challenge Subscribe: Making request with token", {
      hasToken: !!accessToken,
      tokenPreview: accessToken ? `${accessToken.slice(0, 10)}...` : null,
    });

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/challenges/listings/${slug}/subscribe/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    console.log("📡 Challenge Subscribe: Response received", {
      status: response.status,
      ok: response.ok,
      url: response.url,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Challenge Subscribe: Request failed", {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
      });
      throw new Error("Failed to subscribe to challenge");
    }

    const data = await response.json();
    console.log("✅ Challenge Subscribe: Success", { data });
    return data;
  } catch (error) {
    console.error("💥 Challenge Subscribe: Error occurred", {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });
    throw error;
  }
}

export async function unsubscribeFromChallenge(
  slug: string,
  accessToken: string
) {
  console.log("🎯 Challenge Unsubscribe: Starting unsubscription", { slug });

  try {
    console.log("📡 Challenge Unsubscribe: Making request with token", {
      hasToken: !!accessToken,
      tokenPreview: accessToken ? `${accessToken.slice(0, 10)}...` : null,
    });

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/challenges/listings/${slug}/unsubscribe/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    console.log("📡 Challenge Unsubscribe: Response received", {
      status: response.status,
      ok: response.ok,
      url: response.url,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Challenge Unsubscribe: Request failed", {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
      });
      throw new Error("Failed to unsubscribe from challenge");
    }

    const data = await response.json();
    console.log("✅ Challenge Unsubscribe: Success", { data });
    return data;
  } catch (error) {
    console.error("💥 Challenge Unsubscribe: Error occurred", {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });
    throw error;
  }
}

export async function submitSolution(
  slug: string,
  data: {
    code: string;
    documentation?: string;
    language: string;
    is_private?: boolean;
  }
) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/challenges/listings/${slug}/solutions/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.message || `Failed to submit solution: ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error submitting solution:", error);
    throw error instanceof Error
      ? error
      : new Error("Failed to submit solution");
  }
}
