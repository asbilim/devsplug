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
  profile?: string;
  bio?: string;
  motivation?: string;
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
    console.warn("No access token found in session", session);
    return { "Content-Type": "application/json" };
  }

  console.log(
    "Using access token from session",
    session.backendTokens.accessToken.substring(0, 20) + "..."
  );
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
  // Accept a broader type that includes the potential file
  data: Record<string, any>
): Promise<UserProfile | null> {
  try {
    const session = await getSession();
    let headers = getAuthHeaders(session);

    // Log the session and initial headers for debugging
    console.log("Session data:", session);
    console.log("Auth headers (initial):", headers);

    let requestBody: BodyInit;
    let isFormData = false;

    // Check if profile_file exists in the data
    if (data.profile_file instanceof File) {
      isFormData = true;
      const formData = new FormData();

      // Append other fields to FormData
      if (data.bio !== undefined) {
        formData.append("motivation", data.bio);
      }
      if (data.title !== undefined) {
        formData.append("title", data.title);
      }
      // The backend expects the file under the 'profile' key based on the error
      formData.append("profile", data.profile_file);

      requestBody = formData;

      // IMPORTANT: Remove Content-Type header when sending FormData
      // The browser will automatically set it correctly with the boundary
      if (headers["Content-Type"]) {
        delete headers["Content-Type"];
        console.log("Removed Content-Type header for FormData");
      }
    } else {
      // Prepare JSON data if no file is uploaded
      const jsonData: Record<string, any> = {};
      if (data.bio !== undefined) {
        jsonData.motivation = data.bio;
      }
      if (data.title !== undefined) {
        jsonData.title = data.title;
      }
      // Handle profile_picture if it's just a URL or undefined (but not a File)
      if (data.profile_picture !== undefined) {
        jsonData.profile = data.profile_picture; // Assuming backend expects 'profile' for URL too?
      }

      requestBody = JSON.stringify(jsonData);
    }

    // Get the username from the session
    const username = session?.user?.username;
    if (!username) {
      throw new Error("Username not found in session");
    }

    // Log the data being sent
    console.log(
      "Sending data to API (isFormData:",
      isFormData,
      "):",
      requestBody
    );
    console.log("Final Headers:", headers);

    // Use the user-specific endpoint
    const apiUrl = `${API_BASE_URL}/users/api/user/users/${username}/`;
    console.log("API URL:", apiUrl);

    const response = await fetch(apiUrl, {
      method: "PATCH",
      headers,
      body: requestBody, // Use the prepared body (FormData or JSON string)
    });

    // Log the full response for debugging
    console.log("API response status:", response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API error response:", errorText);
      throw new Error(
        `Error updating profile: ${response.statusText} - ${errorText}`
      );
    }

    const result = await response.json();
    console.log("API response data:", result);

    // Map motivation back to bio in the response
    if (result.motivation !== undefined) {
      result.bio = result.motivation;
    }

    return result;
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

export async function getUserPublicProfile(
  username: string
): Promise<UserProfile | null> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/users/api/user/users/${username}/`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      console.error(`Error fetching user profile: ${response.statusText}`);
      return null;
    }

    const data = await response.json();

    // Map motivation back to bio if needed for consistency
    if (data.motivation) {
      data.bio = data.motivation;
    }

    return data;
  } catch (error) {
    console.error(`Failed to fetch user profile for ${username}:`, error);
    return null;
  }
}

/**
 * Follow or unfollow a user
 * @param username Username of the user to follow/unfollow
 * @param action 'follow' or 'unfollow'
 * @returns Success status and response data
 */
export async function toggleFollowUser(
  username: string,
  action: "follow" | "unfollow"
): Promise<{ success: boolean; message?: string }> {
  try {
    // For now, this is a stub since the endpoint isn't implemented
    console.log(
      `${action} user ${username} (API endpoint not implemented yet)`
    );

    const session = await getSession();
    if (!session?.user) {
      return {
        success: false,
        message: "You must be logged in to perform this action",
      };
    }

    // This would be the actual implementation once the API endpoint exists
    /*
    const response = await fetch(
      `${API_BASE_URL}/users/api/user/users/${username}/${action}/`,
      {
        method: 'POST',
        headers: getAuthHeaders(session),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { 
        success: false, 
        message: errorData.message || `Failed to ${action} user` 
      };
    }

    const data = await response.json();
    return { success: true, ...data };
    */

    // Simulate a successful response for now
    return {
      success: true,
      message:
        action === "follow"
          ? `You are now following ${username}`
          : `You have unfollowed ${username}`,
    };
  } catch (error) {
    console.error(`Failed to ${action} user ${username}:`, error);
    return {
      success: false,
      message: `An error occurred while trying to ${action} this user`,
    };
  }
}
