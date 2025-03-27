"use client";

import { useState, useEffect, useTransition } from "react";
import { useSession } from "next-auth/react";
import { CommentList } from "./CommentList";
import { CommentForm } from "./CommentForm";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getComments,
  likeComment,
  deleteComment,
  reportComment,
  createComment,
} from "@/app/actions/comments";
import { validateCommentContent } from "@/lib/comment-utils";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, AlertCircle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface CommentSectionProps {
  challengeSlug: string;
  solutionId: string | number;
  initialComments?: any[];
  commentCount?: number;
}

export function CommentSection({
  challengeSlug,
  solutionId,
  initialComments = [],
  commentCount = 0,
}: CommentSectionProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Ensure we always have arrays even if undefined is passed
  const [comments, setComments] = useState<any[]>(initialComments ?? []);
  const [isLoading, setIsLoading] = useState(
    !(initialComments && initialComments.length > 0)
  );
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(
    commentCount > (initialComments?.length ?? 0)
  );
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [commentCountState, setCommentCount] = useState(commentCount);

  // Report dialog state
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportingCommentId, setReportingCommentId] = useState<
    string | number | null
  >(null);

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState<
    string | number | null
  >(null);

  useEffect(() => {
    if (!initialComments || initialComments.length === 0) {
      loadComments();
    }
  }, [challengeSlug, solutionId, initialComments]);

  const loadComments = async (reset = false) => {
    if (reset) {
      setIsLoading(true);
      setPage(1);
      setComments([]);
    } else if (!reset && isLoading) {
      // Already loading initial comments
      return;
    }

    try {
      const result = await getComments(
        challengeSlug,
        solutionId,
        reset ? 1 : page
      );

      // Safely access the properties with defaults to prevent undefined errors
      const apiComments = result?.comments ?? [];
      const pagination = result?.pagination ?? {
        has_next: false,
        total: 0,
        currentPage: 1,
        totalPages: 1,
      };

      // Transform the API comments structure to match our component's expected format
      const transformedComments = apiComments.map((comment: any) => {
        // Make sure we handle all potentially undefined fields
        return {
          id: comment?.id ?? 0,
          // Map user to author
          author: comment?.user
            ? {
                id: comment.user.id ?? 0,
                username: comment.user.username ?? "Anonymous",
                avatar: comment.user.profile ?? null,
              }
            : {
                id: 0,
                username: "Anonymous",
                avatar: null,
              },
          content: comment?.content ?? "",
          createdAt: comment?.created_at ?? new Date().toISOString(),
          updatedAt: comment?.updated_at,
          likesCount: comment?.likes_count ?? 0,
          repliesCount: 0, // Will be calculated later
          isLikedByUser: comment?.is_liked_by_user ?? false,
          parent: comment?.parent,
        };
      });

      // Calculate replies count for each comment
      if (Array.isArray(transformedComments)) {
        // Count replies for each parent comment
        const replyCounts = new Map();
        transformedComments.forEach((comment) => {
          if (comment.parent) {
            replyCounts.set(
              comment.parent,
              (replyCounts.get(comment.parent) || 0) + 1
            );
          }
        });

        // Update reply counts
        transformedComments.forEach((comment) => {
          if (replyCounts.has(comment.id)) {
            comment.repliesCount = replyCounts.get(comment.id);
          }
        });
      }

      // Update the state with new comments
      setComments((prev) =>
        reset || page === 1
          ? transformedComments
          : [...prev, ...transformedComments]
      );

      // Update pagination state
      setHasMore(!!pagination.has_next);

      // Update the commentCount state so our UI shows the correct total
      if (pagination.total !== undefined && pagination.total !== commentCount) {
        // This updates our local state to match the actual total comment count
        setCommentCount(pagination.total);
      }

      // Prepare for the next page load
      if (reset || page === 1) {
        setPage(2); // Set up for next page load
      } else {
        setPage((prev) => prev + 1);
      }
    } catch (error) {
      toast.error("Failed to load comments. Please try again.");
      console.error("Error loading comments:", error);
      // Ensure we don't leave the component in a loading state
      if (reset) {
        setComments([]);
      }
      setHasMore(false);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    loadComments();
  };

  const handleLike = (commentId: string | number) => {
    if (!session?.user) {
      router.push("/login");
      return;
    }

    // Optimistically update the UI
    setComments((prevComments) =>
      prevComments.map((comment) => {
        if (comment.id === commentId) {
          const wasLiked = comment.isLikedByUser;
          return {
            ...comment,
            isLikedByUser: !wasLiked,
            likesCount: wasLiked
              ? comment.likesCount - 1
              : comment.likesCount + 1,
          };
        }
        // Check if comment is in replies
        else if (comment.replies) {
          return {
            ...comment,
            replies: comment.replies.map((reply) => {
              if (reply.id === commentId) {
                const wasLiked = reply.isLikedByUser;
                return {
                  ...reply,
                  isLikedByUser: !wasLiked,
                  likesCount: wasLiked
                    ? reply.likesCount - 1
                    : reply.likesCount + 1,
                };
              }
              return reply;
            }),
          };
        }
        return comment;
      })
    );

    // Call the API to persist the change
    startTransition(async () => {
      try {
        await likeComment(challengeSlug, solutionId, commentId);
        // API call succeeded, UI is already updated optimistically
      } catch (error) {
        // Revert the optimistic update on error
        setComments((prevComments) =>
          prevComments.map((comment) => {
            if (comment.id === commentId) {
              const isLiked = comment.isLikedByUser;
              return {
                ...comment,
                isLikedByUser: !isLiked,
                likesCount: isLiked
                  ? comment.likesCount - 1
                  : comment.likesCount + 1,
              };
            }
            // Check if comment is in replies
            else if (comment.replies) {
              return {
                ...comment,
                replies: comment.replies.map((reply) => {
                  if (reply.id === commentId) {
                    const isLiked = reply.isLikedByUser;
                    return {
                      ...reply,
                      isLikedByUser: !isLiked,
                      likesCount: isLiked
                        ? reply.likesCount - 1
                        : reply.likesCount + 1,
                    };
                  }
                  return reply;
                }),
              };
            }
            return comment;
          })
        );
        toast.error("Failed to like comment. Please try again.");
        console.error("Error liking comment:", error);
      }
    });
  };

  const handleDelete = (commentId: string | number) => {
    setDeletingCommentId(commentId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingCommentId) return;

    try {
      await deleteComment(challengeSlug, solutionId, deletingCommentId);

      // Remove the deleted comment from state
      setComments((prev) =>
        prev.filter((comment) => {
          // Remove the comment itself
          if (comment.id === deletingCommentId) return false;

          // If it has replies, filter out replies to the deleted comment
          if (comment.replies) {
            comment.replies = comment.replies.filter(
              (reply: any) => reply.id !== deletingCommentId
            );
          }

          return true;
        })
      );

      toast.success("Comment deleted successfully");
    } catch (error) {
      toast.error("Failed to delete comment. Please try again.");
      console.error("Error deleting comment:", error);
    } finally {
      setDeleteDialogOpen(false);
      setDeletingCommentId(null);
    }
  };

  const handleReport = (commentId: string | number) => {
    setReportingCommentId(commentId);
    setReportDialogOpen(true);
  };

  const submitReport = async () => {
    if (!reportingCommentId || !reportReason.trim()) return;

    try {
      await reportComment(
        challengeSlug,
        solutionId,
        reportingCommentId,
        reportReason
      );
      toast.success(
        "Comment reported successfully. Thank you for helping keep our community safe."
      );
    } catch (error) {
      toast.error("Failed to report comment. Please try again.");
      console.error("Error reporting comment:", error);
    } finally {
      setReportDialogOpen(false);
      setReportingCommentId(null);
      setReportReason("");
    }
  };

  const handleCommentSuccess = (
    content: string,
    parentId?: string | number
  ) => {
    if (!session?.user) return;

    // Create a new comment object
    const newComment = {
      id: Date.now(), // Temporary ID until refresh
      author: {
        id: session.user.id || "0",
        username: session.user.username || "Anonymous",
        avatar: session.user.image || null,
      },
      content: content,
      createdAt: new Date().toISOString(),
      likesCount: 0,
      repliesCount: 0,
      isLikedByUser: false,
      parent: parentId || null,
    };

    // Update the state with the new comment
    setComments((prevComments) => {
      // For replies, we need to update the parent comment's replies
      if (parentId) {
        return prevComments.map((comment) => {
          if (comment.id === parentId) {
            // Update the replies count for the parent
            return {
              ...comment,
              repliesCount: (comment.repliesCount || 0) + 1,
            };
          }
          return comment;
        });
      }

      // For top-level comments, just add it to the list
      return [newComment, ...prevComments];
    });

    // Increase comment count
    setCommentCount((prev) => prev + 1);

    // Show success message
    toast.success("Comment posted successfully!");

    // Also refresh comments in the background to get the actual data from the server
    loadComments(true);
  };

  const handleReplySubmit = async (
    parentId: string | number,
    content: string
  ) => {
    if (!session?.user) {
      router.push("/login");
      return;
    }

    try {
      // Ensure content is a string and validate it
      const contentStr = content ? String(content) : "";
      const validationResult = validateCommentContent(contentStr);

      if (!validationResult.isValid) {
        toast.error(validationResult.error || "Invalid comment content");
        return Promise.reject(new Error(validationResult.error));
      }

      await createComment({
        content: contentStr,
        challengeSlug,
        solutionId: solutionId.toString(),
        parentId: parentId.toString(),
      });

      // Create a new reply object
      const newReply = {
        id: Date.now(), // Temporary ID until refresh
        author: {
          id: session.user.id || "0",
          username: session.user.username || "Anonymous",
          avatar: session.user.image || null,
        },
        content: contentStr,
        createdAt: new Date().toISOString(),
        likesCount: 0,
        repliesCount: 0,
        isLikedByUser: false,
        parent: parentId,
      };

      // Add the reply to the comments array and update the parent's replies count
      setComments((prevComments) => {
        const updatedComments = [...prevComments];
        // Add the new reply
        updatedComments.push(newReply);

        // Update the parent comment's replies count
        return updatedComments.map((comment) => {
          if (comment.id === parentId) {
            return {
              ...comment,
              repliesCount: (comment.repliesCount || 0) + 1,
            };
          }
          return comment;
        });
      });

      // Increase total comment count
      setCommentCount((prev) => prev + 1);

      // Show success message
      toast.success("Reply posted successfully!");

      // Also refresh comments in the background to get the actual data from the server
      loadComments(true);

      return Promise.resolve();
    } catch (error) {
      console.error("Error submitting reply:", error);
      toast.error("Failed to post reply. Please try again.");
      return Promise.reject(error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Comments {commentCountState > 0 && `(${commentCountState})`}
        </CardTitle>
        <CardDescription>
          Share your thoughts, ask questions, or provide feedback on this
          solution
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <CommentForm
          challengeSlug={challengeSlug}
          solutionId={solutionId}
          user={session?.user || null}
          onSuccess={handleCommentSuccess}
        />

        <Separator />

        {/* Pagination info message */}
        {commentCountState > 0 && (
          <div className="text-xs text-muted-foreground">
            <p>
              Showing comments{" "}
              {page > 1
                ? `1-${Math.min(comments.length, 10 * (page - 1))}`
                : `1-${Math.min(comments.length, 10)}`}{" "}
              of {commentCountState}
              <span className="ml-1 italic">
                (pagination handled on client side)
              </span>
            </p>
          </div>
        )}

        <CommentList
          challengeSlug={challengeSlug}
          solutionId={solutionId}
          comments={comments}
          currentUser={session?.user || null}
          onLike={handleLike}
          onDelete={handleDelete}
          onReport={handleReport}
          onReplySubmit={handleReplySubmit}
          isLoading={isLoading}
          showLoadMore={hasMore}
          onLoadMore={handleLoadMore}
          isLoadingMore={isLoadingMore}
        />
      </CardContent>

      {/* Report Dialog */}
      <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report Comment</DialogTitle>
            <DialogDescription>
              Please provide a reason for reporting this comment. Your report
              will be reviewed by our moderation team.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <Textarea
              placeholder="Explain why you're reporting this comment..."
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setReportDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submitReport} disabled={!reportReason.trim()}>
              Submit Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Comment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this comment? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
