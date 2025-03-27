"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { CommentData } from "@/components/comments/CommentItem";
import { revalidatePath } from "next/cache";
import { validateCommentContent } from "@/lib/comment-utils";

interface CommentParams {
  content: string;
  challengeSlug: string;
  solutionId: string;
  parentId?: string;
}

/**
 * Fetches comments for a specific solution
 */
export async function getComments(
  challengeSlug: string,
  solutionId: string | number,
  page = 1,
  limit = 20
) {
  try {
    // Always fetch all comments from the backend
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/challenges/listings/${challengeSlug}/solutions/${solutionId}/comments/`,
      {
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch comments: ${response.status}`);
    }

    const allComments = await response.json();
    
    // Ensure we always have a properly structured response
    const comments = Array.isArray(allComments) ? allComments : [];
    
    // Implement client-side pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedComments = comments.slice(startIndex, endIndex);
    
    // Calculate pagination info
    const total = comments.length;
    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    
    return {
      comments: paginatedComments,
      pagination: {
        total,
        totalPages,
        currentPage: page,
        limit,
        has_next: hasNext
      }
    };
  } catch (error) {
    console.error("Error fetching comments:", error);
    // Return a properly structured empty response rather than throwing
    return {
      comments: [],
      pagination: {
        total: 0,
        totalPages: 0,
        currentPage: page,
        limit,
        has_next: false
      }
    };
  }
}

/**
 * Creates a new comment on a solution
 */
export async function createComment({
  content,
  challengeSlug,
  solutionId,
  parentId = "0",
}: CommentParams) {
  try {
    // Validate the content
    const validationResult = validateCommentContent(content);
    if (!validationResult.isValid) {
      throw new Error(validationResult.error || "Invalid comment content");
    }

    // Get the user's session for authentication
    const session = await getServerSession(authOptions);
    if (!session?.user || !session.backendTokens?.accessToken) {
      throw new Error("You must be logged in to comment");
    }

    // Build the API URL
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/challenges/listings/${challengeSlug}/solutions/${solutionId}/comments/`;

    // Make the API request to create the comment
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.backendTokens.accessToken}`,
      },
      body: JSON.stringify({
        content,
        parent: parentId === "0" ? null : parseInt(parentId, 10),
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message ||
          `Failed to create comment: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    // Revalidate the page to refresh the comments
    revalidatePath(`/challenges/${challengeSlug}/solutions/${solutionId}`);

    return { success: true, comment: data };
  } catch (error) {
    console.error("Error creating comment:", error);
    throw error;
  }
}

export async function likeComment(
  challengeSlug: string,
  solutionId: string | number,
  commentId: string | number
) {
  try {
    // Get the user's session for authentication
    const session = await getServerSession(authOptions);
    if (!session?.user || !session.backendTokens?.accessToken) {
      throw new Error("You must be logged in to like comments");
    }

    // Build the API URL
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/challenges/listings/${challengeSlug}/solutions/${solutionId}/comments/${commentId}/like/`;

    // Make the API request to like the comment
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.backendTokens.accessToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message ||
          `Failed to like comment: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    // Revalidate the page to refresh the comments
    revalidatePath(`/challenges/${challengeSlug}/solutions/${solutionId}`);

    return { success: true, data };
  } catch (error) {
    console.error("Error liking comment:", error);
    throw error;
  }
}

export async function deleteComment(
  challengeSlug: string,
  solutionId: string | number,
  commentId: string | number
) {
  try {
    // Get the user's session for authentication
    const session = await getServerSession(authOptions);
    if (!session?.user || !session.backendTokens?.accessToken) {
      throw new Error("You must be logged in to delete comments");
    }

    // Build the API URL
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/challenges/listings/${challengeSlug}/solutions/${solutionId}/comments/${commentId}/`;

    // Make the API request to delete the comment
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${session.backendTokens.accessToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message ||
          `Failed to delete comment: ${response.status} ${response.statusText}`
      );
    }

    // Revalidate the page to refresh the comments
    revalidatePath(`/challenges/${challengeSlug}/solutions/${solutionId}`);

    return { success: true };
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw error;
  }
}

export async function reportComment(
  challengeSlug: string,
  solutionId: string | number,
  commentId: string | number,
  reason: string
) {
  try {
    // Get the user's session for authentication
    const session = await getServerSession(authOptions);
    if (!session?.user || !session.backendTokens?.accessToken) {
      throw new Error("You must be logged in to report comments");
    }

    // Build the API URL
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/challenges/listings/${challengeSlug}/solutions/${solutionId}/comments/${commentId}/report/`;

    // Make the API request to report the comment
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.backendTokens.accessToken}`,
      },
      body: JSON.stringify({ reason }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message ||
          `Failed to report comment: ${response.status} ${response.statusText}`
      );
    }

    return { success: true };
  } catch (error) {
    console.error("Error reporting comment:", error);
    throw error;
  }
}
