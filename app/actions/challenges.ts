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

    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/challenges/listings/?${params}`;

    const res = await fetch(url, {
      cache: "no-cache",
      next: { tags: ["challenges"] },
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("❌ getChallenges: API Error:", {
        status: res.status,
        statusText: res.statusText,
        error: errorText,
        url: res.url,
      });
      throw new Error(
        `Failed to fetch challenges: ${res.status} ${res.statusText}`
      );
    }

    const data = await res.json();

    // Calculate total pages based on count and items per page
    const totalPages = Math.ceil(data.count / ITEMS_PER_PAGE);

    return {
      data: data.results || [], // Changed from data.data to data.results
      totalPages,
      currentPage: page,
    };
  } catch (error) {
    return {
      data: [],
      totalPages: 1,
      currentPage: Number(page),
    };
  }
};

export async function subscribeToChallenge(slug: string, accessToken: string) {
  try {
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

    return data;
  } catch (error) {
    throw error;
  }
}

export async function unsubscribeFromChallenge(
  slug: string,
  accessToken: string
) {
  try {
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

    // Handle 204 No Content response - this is a success case
    if (response.status === 204) {
      return { success: true };
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error("Failed to unsubscribe from challenge");
    }

    // For non-204 success responses, try to parse JSON
    try {
      const data = await response.json();
      return data;
    } catch (e) {
      // If there's no JSON but response was OK, return success
      return { success: true };
    }
  } catch (error) {
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
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/challenges/listings/${slug}/solutions/`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch((parseError) => {
        console.error(
          "❌ submitSolution: Failed to parse error response",
          parseError
        );
        return { message: `Status ${response.status}: ${response.statusText}` };
      });

      console.error("❌ submitSolution: Request failed", {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
        url: response.url,
      });

      throw new Error(
        errorData?.message || `Failed to submit solution: ${response.status}`
      );
    }

    const responseData = await response.json();

    return responseData;
  } catch (error) {
    throw error instanceof Error
      ? error
      : new Error("Failed to submit solution");
  }
}

export async function checkChallengeSubscription(
  slug: string,
  accessToken: string
) {
  try {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/challenges/listings/${slug}/check-subscription/`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorText = await response
        .text()
        .catch(() => "Failed to read error response");

      throw new Error(
        `Failed to check subscription status: ${response.status}`
      );
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("💥 checkChallengeSubscription: Error occurred", {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });
    return {
      is_subscribed: false,
      authenticated: false,
      message: "Error checking subscription status",
    };
  }
}

export async function checkChallengeRegistration(
  slug: string,
  accessToken: string
): Promise<{ is_registered: boolean; authenticated: boolean }> {
  try {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/challenges/listings/${slug}/check_registration/`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorText = await response
        .text()
        .catch(() => "Failed to read error response");
      throw new Error(
        `Failed to check registration status: ${response.status}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

export async function registerForChallenge(slug: string, accessToken: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/challenges/listings/${slug}/register/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();

      throw new Error("Failed to register for challenge");
    }

    const data = await response.json();

    return data;
  } catch (error) {
    throw error;
  }
}

export async function unregisterFromChallenge(
  slug: string,
  accessToken: string
) {
  try {
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

    if (!response.ok) {
      const errorText = await response.text();

      throw new Error("Failed to unregister from challenge");
    }

    const data = await response.json();

    return data;
  } catch (error) {
    throw error;
  }
}
