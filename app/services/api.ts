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

export interface UserStats {
  completion_rate: number;
  total_solutions: number;
  followers_count?: number;
  following_count?: number;
  total_points?: number;
}

// API functions
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Helper function to get auth headers from session
function getAuthHeaders(session: any): Record<string, string> {
  if (!session?.backendTokens?.accessToken) {
    return { "Content-Type": "application/json" };
  }

  return {
    Authorization: `Bearer ${session.backendTokens.accessToken}`,
    "Content-Type": "application/json",
  };
}

export async function getUserChallenges(): Promise<ChallengeSubscription[]> {
  try {
    const session = await getSession();
    const headers = getAuthHeaders(session);
    const response = await fetch(
      `${API_BASE_URL}/challenges/listings/my_subscriptions/`,
      { headers }
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
  data: Partial<UserProfile>
): Promise<UserProfile | null> {
  try {
    const session = await getSession();
    const headers = getAuthHeaders(session);
    const response = await fetch(`${API_BASE_URL}/users/profile/`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Error updating profile: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to update profile:", error);
    return null;
  }
}

export async function getUserStats(): Promise<UserStats> {
  try {
    const session = await getSession();
    const headers = getAuthHeaders(session);
    const response = await fetch(`${API_BASE_URL}/users/stats/`, {
      headers,
    });

    if (!response.ok) {
      throw new Error(`Error fetching user stats: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to fetch user stats:", error);
    return {
      completion_rate: 0,
      total_solutions: 0,
      followers_count: 0,
      following_count: 0,
      total_points: 0,
    };
  }
}

export interface SolutionSubmission {
  challenge: number;
  code: string;
  documentation: string;
  language: string;
  is_private: boolean;
}

export interface SubmissionResponse {
  id: number;
  challenge: number;
  user: number;
  code: string;
  documentation: string;
  language: string;
  is_private: boolean;
  created_at: string;
  updated_at: string;
  status: string;
}

export async function submitSolution(
  submission: SolutionSubmission
): Promise<SubmissionResponse> {
  try {
    const session = await getSession();
    const headers = getAuthHeaders(session);

    const response = await fetch(`${API_BASE_URL}/challenges/solutions/`, {
      method: "POST",
      headers,
      body: JSON.stringify(submission),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error submitting solution:", error);
    throw error;
  }
}

// Session storage functions
export interface StoredSolution {
  challengeId: number;
  challengeSlug: string;
  code: string;
  documentation: string;
  language: string;
  isPrivate: boolean;
  lastUpdated: string;
}

export function saveSolutionToSession(solution: StoredSolution): void {
  if (typeof window !== "undefined") {
    const key = `challenge_solution_${solution.challengeSlug}`;
    window.sessionStorage.setItem(key, JSON.stringify(solution));
  }
}

export function getSolutionFromSession(
  challengeSlug: string
): StoredSolution | null {
  if (typeof window !== "undefined") {
    const key = `challenge_solution_${challengeSlug}`;
    const storedSolution = window.sessionStorage.getItem(key);
    if (storedSolution) {
      return JSON.parse(storedSolution);
    }
  }
  return null;
}

export function clearSolutionFromSession(challengeSlug: string): void {
  if (typeof window !== "undefined") {
    const key = `challenge_solution_${challengeSlug}`;
    window.sessionStorage.removeItem(key);
  }
}
