/**
 * Solution types for the application
 */

/**
 * Solution user information
 */
export interface SolutionUser {
  id: number;
  username: string;
  profile?: string | null;
  title?: string;
}

/**
 * Challenge information for solutions
 */
export interface SolutionChallenge {
  id: number;
  title: string;
  slug: string;
  difficulty: string;
  description?: string;
}

/**
 * Solution data structure
 */
export interface Solution {
  id: number;
  user: SolutionUser;
  language: string;
  likes_count: number;
  comments_count?: number;
  created_at: string;
  status: string;
  is_private: boolean;
  challenge?: SolutionChallenge;
  challenge_slug?: string;
  challenge_id?: number;
  code?: string;
  documentation?: string;
}

/**
 * Solution group by challenge
 */
export interface SolutionGroup {
  challenge: SolutionChallenge;
  solutions: Solution[];
}

/**
 * API response for solutions
 */
export interface SolutionsResponse {
  solutions: Solution[];
  total: number;
  totalPages?: number;
}

/**
 * Options for fetching solutions
 */
export interface GetSolutionsOptions {
  page?: number;
  language?: string;
  sort?: string;
  limit?: number;
}
