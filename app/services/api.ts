import { getSession } from "next-auth/react";

// Types
export interface Challenge {
  id: number;
  title: string;
  slug: string;
  description: string;
  difficulty: string;
  points: number;
  tags: string[];
  category: {
    id: number;
    name: string;
    slug: string;
    description: string;
    icon: string;
    order: number;
    stats: {
      total_challenges: number;
      avg_difficulty: number;
      total_solutions: number;
    };
  };
  estimated_time: number;
  completion_rate: number;
  user_status: {
    status: string;
    submitted_at: string;
  };
}

export interface ChallengeSubscription {
  id: number;
  challenge: Challenge;
  is_subscribed: boolean;
  subscribed_at: string;
  last_attempted_at: string | null;
  completed: boolean;
  completed_at: string | null;
  attempts: number;
  successful_attempts: number;
  solution_status: {
    status: string;
    submitted_at: string;
    language: string;
  };
  challenge_stats: {
    total_attempts: number;
    successful_attempts: number;
    total_likes: number;
    completion_rate: number;
  };
}

export interface UserProfile {
  username: string;
  email: string;
  score: number;
  title: string;
  followers_count: number;
  following_count: number;
  profile_picture?: string;
  bio?: string;
  social_links?: {
    github?: string;
    twitter?: string;
    linkedin?: string;
    website?: string;
  };
}

// API functions
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

async function getAuthHeaders() {
  const session = await getSession();
  if (!session?.backendTokens?.accessToken) {
    throw new Error("No access token found in session");
  }
  return {
    Authorization: `Bearer ${session.backendTokens.accessToken}`,
    "Content-Type": "application/json",
  };
}

export async function getUserChallenges(): Promise<ChallengeSubscription[]> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(
      `${API_BASE_URL}/challenges/listings/my_subscriptions/`,
      {
        headers,
      }
    );

    if (!response.ok) {
      throw new Error(`Error fetching user challenges: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to fetch user challenges:", error);
    return [];
  }
}

export async function updateUserProfile(
  profileData: Partial<UserProfile>
): Promise<UserProfile | null> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/users/profile/`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      throw new Error(`Error updating profile: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to update user profile:", error);
    return null;
  }
}

export async function getUserStats(): Promise<any> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/users/stats/`, {
      headers,
    });

    if (!response.ok) {
      throw new Error(`Error fetching user stats: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to fetch user stats:", error);
    return null;
  }
}
