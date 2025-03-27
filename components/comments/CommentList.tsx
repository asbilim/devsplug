"use client";

import { useState } from "react";
import { Comment } from "./Comment";
import { CommentForm } from "./CommentForm";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ChevronDown, Loader2, MessageSquare } from "lucide-react";
import { User } from "next-auth";
import { useRouter } from "next/navigation";

interface CommentData {
  id: string | number;
  author: {
    id: string | number;
    username: string;
    avatar?: string;
  };
  content: string;
  createdAt: string;
  updatedAt?: string;
  likesCount: number;
  repliesCount: number;
  isLikedByUser: boolean;
  parent?: number | null;
  replies?: CommentData[];
}

interface CommentListProps {
  challengeSlug: string;
  solutionId: string | number;
  comments: CommentData[];
  currentUser: User | null;
  onLike: (commentId: string | number) => void;
  onDelete: (commentId: string | number) => void;
  onReport: (commentId: string | number) => void;
  onReplySubmit: (parentId: string | number, content: string) => Promise<void>;
  isLoading: boolean;
  showLoadMore?: boolean;
  onLoadMore?: () => void;
  isLoadingMore?: boolean;
}

export function CommentList({
  challengeSlug,
  solutionId,
  comments,
  currentUser,
  onLike,
  onDelete,
  onReport,
  onReplySubmit,
  isLoading,
  showLoadMore = false,
  onLoadMore,
  isLoadingMore = false,
}: CommentListProps) {
  const [replyingTo, setReplyingTo] = useState<string | number | null>(null);
  const [expandedThreads, setExpandedThreads] = useState<Set<string | number>>(
    new Set()
  );
  const router = useRouter();

  // Safely filter top-level comments, ensuring comments is always an array
  const topLevelComments = Array.isArray(comments)
    ? comments.filter((comment) => !comment?.parent)
    : [];

  const handleReply = (commentId: string | number) => {
    if (!currentUser) {
      router.push("/login");
      return;
    }
    setReplyingTo(commentId === replyingTo ? null : commentId);
  };

  const handleReplySubmit = async (
    parentId: string | number,
    content: string
  ) => {
    try {
      await onReplySubmit(parentId, content);
      setReplyingTo(null);
    } catch (error) {
      console.error("Error submitting reply:", error);
    }
  };

  const toggleReplies = (commentId: string | number) => {
    const newExpandedThreads = new Set(expandedThreads);
    if (newExpandedThreads.has(commentId)) {
      newExpandedThreads.delete(commentId);
    } else {
      newExpandedThreads.add(commentId);
    }
    setExpandedThreads(newExpandedThreads);
  };

  // Find children comments of a parent comment, safely handling undefined values
  const findReplies = (parentId: string | number) => {
    if (!Array.isArray(comments)) return [];
    return comments.filter((comment) => comment?.parent === parentId);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (topLevelComments.length === 0) {
    return (
      <div className="py-6 text-center">
        <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground/50 mb-3" />
        <h3 className="text-lg font-medium mb-1">No comments yet</h3>
        <p className="text-muted-foreground mb-4">
          Be the first to share your thoughts on this solution
        </p>
        <CommentForm
          challengeSlug={challengeSlug}
          solutionId={solutionId}
          user={currentUser}
          placeholder="Start the discussion..."
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {topLevelComments.map((comment) => {
        // Safely handle undefined comment or fields
        if (!comment) return null;

        const commentId = comment.id ?? 0;
        const replies = findReplies(commentId);
        const isExpanded = expandedThreads.has(commentId);

        // Safely access author properties with fallbacks
        const author = comment.author || {
          id: 0,
          username: "Anonymous",
          avatar: null,
        };
        const authorId = author.id?.toString() || "0";
        const authorName = author.username || "Anonymous";

        // Safely access other properties with fallbacks
        const content = comment.content || "";
        const createdAt = comment.createdAt || new Date().toISOString();
        const updatedAt = comment.updatedAt;
        const likesCount = comment.likesCount || 0;
        const repliesCount = replies.length || 0;
        const isLikedByUser = comment.isLikedByUser || false;
        const isCurrentUserAuthor = currentUser?.id === authorId;

        return (
          <div key={commentId} className="space-y-2">
            <Comment
              id={commentId}
              author={author}
              content={content}
              createdAt={createdAt}
              updatedAt={updatedAt}
              likesCount={likesCount}
              repliesCount={repliesCount}
              isLikedByUser={isLikedByUser}
              isAuthor={isCurrentUserAuthor}
              currentUser={currentUser}
              onReply={handleReply}
              onLike={onLike}
              onDelete={onDelete}
              onReport={onReport}
            />

            {replyingTo === commentId && (
              <div className="ml-12 mt-2">
                <CommentForm
                  challengeSlug={challengeSlug}
                  solutionId={solutionId}
                  parentId={commentId}
                  user={currentUser}
                  onSuccess={handleReplySubmit}
                  onCancel={() => setReplyingTo(null)}
                  placeholder={`Reply to ${authorName}...`}
                  autoFocus
                />
              </div>
            )}

            {replies.length > 0 && (
              <div className="mt-2">
                {!isExpanded && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-12 text-xs text-muted-foreground"
                    onClick={() => toggleReplies(commentId)}>
                    <ChevronDown className="h-4 w-4 mr-1" />
                    Show {replies.length}{" "}
                    {replies.length === 1 ? "reply" : "replies"}
                  </Button>
                )}

                {isExpanded && (
                  <div className="ml-12 space-y-4 pt-2 border-l-2 border-border pl-4">
                    {replies.map((reply) => {
                      // Safely handle undefined reply or fields
                      if (!reply) return null;

                      const replyId = reply.id ?? 0;

                      // Safely access author properties with fallbacks
                      const replyAuthor = reply.author || {
                        id: 0,
                        username: "Anonymous",
                        avatar: null,
                      };
                      const replyAuthorId = replyAuthor.id?.toString() || "0";
                      const replyAuthorName =
                        replyAuthor.username || "Anonymous";

                      // Safely access other properties with fallbacks
                      const replyContent = reply.content || "";
                      const replyCreatedAt =
                        reply.createdAt || new Date().toISOString();
                      const replyUpdatedAt = reply.updatedAt;
                      const replyLikesCount = reply.likesCount || 0;
                      const replyIsLikedByUser = reply.isLikedByUser || false;
                      const isReplyAuthor = currentUser?.id === replyAuthorId;

                      return (
                        <div key={replyId} className="space-y-2">
                          <Comment
                            id={replyId}
                            author={replyAuthor}
                            content={replyContent}
                            createdAt={replyCreatedAt}
                            updatedAt={replyUpdatedAt}
                            likesCount={replyLikesCount}
                            repliesCount={0} // No nested replies for now
                            isLikedByUser={replyIsLikedByUser}
                            isAuthor={isReplyAuthor}
                            currentUser={currentUser}
                            onReply={handleReply}
                            onLike={onLike}
                            onDelete={onDelete}
                            onReport={onReport}
                          />

                          {replyingTo === replyId && (
                            <div className="mt-2">
                              <CommentForm
                                challengeSlug={challengeSlug}
                                solutionId={solutionId}
                                parentId={commentId} // Reply to the parent, not to the reply (no nested threads)
                                user={currentUser}
                                onSuccess={handleReplySubmit}
                                onCancel={() => setReplyingTo(null)}
                                placeholder={`Reply to ${replyAuthorName}...`}
                                autoFocus
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}

                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-muted-foreground"
                      onClick={() => toggleReplies(commentId)}>
                      Hide replies
                    </Button>
                  </div>
                )}
              </div>
            )}

            <Separator className="my-4" />
          </div>
        );
      })}

      {showLoadMore && (
        <div className="flex justify-center mt-6">
          <Button
            variant="outline"
            onClick={onLoadMore}
            disabled={isLoadingMore}>
            {isLoadingMore ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              "Load more comments"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
