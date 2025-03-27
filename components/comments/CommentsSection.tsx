"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { CommentForm } from "./CommentForm";
import { CommentItem, CommentData } from "./CommentItem";
import { getComments } from "@/app/actions/comments";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageSquare, RefreshCw } from "lucide-react";

interface CommentsSectionProps {
  challengeSlug: string;
  solutionId: number;
}

export function CommentsSection({
  challengeSlug,
  solutionId,
}: CommentsSectionProps) {
  const t = useTranslations("Challenge.solutionDetails.comments");
  const [comments, setComments] = useState<CommentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to organize comments into a threaded structure
  const organizeComments = (flatComments: CommentData[]): CommentData[] => {
    const commentMap: Record<number, CommentData> = {};
    const rootComments: CommentData[] = [];

    // First pass: create a map of all comments by ID
    flatComments.forEach((comment) => {
      // Create a clone of the comment with an empty replies array
      const commentWithReplies = { ...comment, replies: [] };
      commentMap[comment.id] = commentWithReplies;
    });

    // Second pass: organize into parent/child relationships
    flatComments.forEach((comment) => {
      if (comment.parent === 0 || !commentMap[comment.parent]) {
        // This is a root comment or has an invalid parent
        rootComments.push(commentMap[comment.id]);
      } else {
        // This is a reply, add it to its parent's replies
        if (!commentMap[comment.parent].replies) {
          commentMap[comment.parent].replies = [];
        }
        commentMap[comment.parent].replies!.push(commentMap[comment.id]);
      }
    });

    return rootComments;
  };

  const fetchComments = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await getComments(challengeSlug, solutionId);
      if (result.error) {
        throw new Error(result.error);
      }

      // Organize comments into a threaded structure
      const organizedComments = organizeComments(result.comments);
      setComments(organizedComments);
    } catch (err) {
      console.error("Error fetching comments:", err);
      setError(t("fetchError"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [challengeSlug, solutionId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCommentAdded = (newComment: CommentData) => {
    // If it's a root comment, add it to the top
    if (newComment.parent === 0) {
      setComments((prevComments) => [newComment, ...prevComments]);
    } else {
      // Otherwise, we need to find the parent and add it to its replies
      setComments((prevComments) => {
        const updatedComments = [...prevComments];

        // Helper function to recursively find and update the parent comment
        const findAndUpdateParent = (
          comments: CommentData[],
          parentId: number
        ): boolean => {
          for (let i = 0; i < comments.length; i++) {
            if (comments[i].id === parentId) {
              // Found the parent, add the reply
              if (!comments[i].replies) {
                comments[i].replies = [];
              }
              comments[i].replies!.push(newComment);
              return true;
            }

            // Check if the parent is in the replies
            if (comments[i].replies && comments[i].replies.length > 0) {
              if (findAndUpdateParent(comments[i].replies, parentId)) {
                return true;
              }
            }
          }

          return false;
        };

        findAndUpdateParent(updatedComments, newComment.parent);
        return updatedComments;
      });
    }
  };

  const handleReplyAdded = (parentId: number, reply: CommentData) => {
    handleCommentAdded(reply);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-muted-foreground" />
            {t("title")}
          </div>

          {!isLoading && (
            <Button
              variant="ghost"
              size="sm"
              onClick={fetchComments}
              className="flex items-center gap-1">
              <RefreshCw className="h-3.5 w-3.5" />
              {t("refresh")}
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Add comment form at the top */}
          <div className="mb-6">
            <CommentForm
              challengeSlug={challengeSlug}
              solutionId={solutionId}
              onSuccess={handleCommentAdded}
            />
          </div>

          {/* Loading state */}
          {isLoading && (
            <div className="space-y-4">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="flex space-x-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="p-4 text-center text-muted-foreground bg-muted/30 rounded-md">
              <p>{error}</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={fetchComments}>
                {t("tryAgain")}
              </Button>
            </div>
          )}

          {/* No comments state */}
          {!isLoading && !error && comments.length === 0 && (
            <div className="p-6 text-center text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p>{t("noComments")}</p>
              <p className="text-sm mt-1">{t("beFirst")}</p>
            </div>
          )}

          {/* Comments list */}
          {!isLoading && !error && comments.length > 0 && (
            <div className="space-y-6">
              {comments.map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  challengeSlug={challengeSlug}
                  solutionId={solutionId}
                  onReplyAdded={handleReplyAdded}
                />
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
