"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { formatRelativeTime } from "@/lib/utils";
import { MessageSquare, ThumbsUp, MoreHorizontal, Reply } from "lucide-react";
import { CommentForm } from "./CommentForm";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { processCommentText } from "@/lib/comment-utils";

export interface CommentData {
  id: number;
  content: string;
  created_at: string;
  updated_at?: string;
  parent: number;
  likes_count: number;
  user: {
    id: number;
    username: string;
    profile?: string;
  };
  replies?: CommentData[];
  is_edited?: boolean;
}

interface CommentItemProps {
  comment: CommentData;
  challengeSlug: string;
  solutionId: number;
  onReplyAdded: (commentId: number, reply: CommentData) => void;
  depth?: number;
  maxDepth?: number;
}

export function CommentItem({
  comment,
  challengeSlug,
  solutionId,
  onReplyAdded,
  depth = 0,
  maxDepth = 3,
}: CommentItemProps) {
  const { data: session } = useSession();
  const t = useTranslations("Challenge.solutionDetails.comments");
  const [isReplying, setIsReplying] = useState(false);
  const [showReplies, setShowReplies] = useState(depth < 2);
  const isAuthor = session?.user?.id === String(comment.user.id);

  // Process content to highlight mentions and solution references
  const processedContent = processCommentText(comment.content);

  const handleReplySuccess = (newReply: CommentData) => {
    onReplyAdded(comment.id, newReply);
    setIsReplying(false);
    setShowReplies(true);
  };

  const toggleReplies = () => {
    setShowReplies(!showReplies);
  };

  return (
    <div className={`comment ${depth > 0 ? "ml-6" : ""}`}>
      <div className="flex space-x-3 mb-2">
        <Avatar className="h-8 w-8 border border-border">
          <AvatarImage
            src={comment.user.profile || ""}
            alt={comment.user.username}
          />
          <AvatarFallback className="bg-primary/10 text-primary font-medium">
            {comment.user.username.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <div className="bg-muted/30 rounded-lg p-3">
            <div className="flex justify-between items-center mb-1">
              <div className="font-medium">{comment.user.username}</div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">{t("options")}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {isAuthor && (
                    <>
                      <DropdownMenuItem>{t("edit")}</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        {t("delete")}
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuItem>{t("report")}</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div
              className="text-sm whitespace-pre-wrap break-words"
              dangerouslySetInnerHTML={{ __html: processedContent }}
            />

            {comment.is_edited && (
              <div className="text-xs text-muted-foreground mt-1">
                {t("edited")}
              </div>
            )}
          </div>

          <div className="flex items-center mt-1 text-xs text-muted-foreground space-x-4">
            <span>{formatRelativeTime(comment.created_at)}</span>

            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-1 text-muted-foreground hover:text-foreground"
              onClick={() => setIsReplying(!isReplying)}>
              <Reply className="h-3.5 w-3.5 mr-1" />
              {t("reply")}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-1 text-muted-foreground hover:text-foreground">
              <ThumbsUp className="h-3.5 w-3.5 mr-1" />
              {comment.likes_count > 0 ? comment.likes_count : t("like")}
            </Button>
          </div>

          {isReplying && (
            <div className="mt-3">
              <CommentForm
                challengeSlug={challengeSlug}
                solutionId={solutionId}
                parentId={comment.id}
                onSuccess={handleReplySuccess}
                placeholder={t("replyTo", { username: comment.user.username })}
                autoFocus
                isReply
                onCancel={() => setIsReplying(false)}
              />
            </div>
          )}

          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-3">
              <Button
                variant="ghost"
                size="sm"
                className="px-1 text-muted-foreground hover:text-foreground flex items-center"
                onClick={toggleReplies}>
                <MessageSquare className="h-3.5 w-3.5 mr-1" />
                {showReplies
                  ? t("hideReplies", { count: comment.replies.length })
                  : t("showReplies", { count: comment.replies.length })}
              </Button>

              {showReplies && depth < maxDepth && (
                <div className="mt-2 pl-2 border-l-2 border-border">
                  {comment.replies.map((reply) => (
                    <CommentItem
                      key={reply.id}
                      comment={reply}
                      challengeSlug={challengeSlug}
                      solutionId={solutionId}
                      onReplyAdded={onReplyAdded}
                      depth={depth + 1}
                      maxDepth={maxDepth}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
