"use client";

import { useState, useEffect } from "react";
import { formatRelativeTime } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { processCommentText } from "@/lib/comment-utils";
import { User } from "next-auth";
import {
  MessageSquare,
  Heart,
  Flag,
  MoreHorizontal,
  Reply,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export interface CommentProps {
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
  isAuthor: boolean;
  currentUser?: User | null;
  onReply: (commentId: string | number) => void;
  onLike: (commentId: string | number) => void;
  onDelete?: (commentId: string | number) => void;
  onReport?: (commentId: string | number) => void;
}

export function Comment({
  id = 0,
  author = { id: 0, username: "Anonymous" },
  content = "",
  createdAt = new Date().toISOString(),
  updatedAt,
  likesCount = 0,
  repliesCount = 0,
  isLikedByUser = false,
  isAuthor = false,
  currentUser,
  onReply,
  onLike,
  onDelete,
  onReport,
}: CommentProps) {
  const [isLiked, setIsLiked] = useState(isLikedByUser);
  const [likeCount, setLikeCount] = useState(likesCount);
  const [isMounted, setIsMounted] = useState(false);
  const [processedContent, setProcessedContent] = useState("");

  // Handle client-side only code in useEffect to prevent hydration errors
  useEffect(() => {
    setIsMounted(true);

    // Process content after the component is mounted to avoid hydration issues
    if (content) {
      setProcessedContent(processCommentText(content));
    }
  }, [content]);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
    onLike(id);
  };

  const handleReply = () => {
    onReply(id);
  };

  const getInitials = (username: string = "AN") => {
    if (!username || username.length === 0) return "AN";
    return username.slice(0, 2).toUpperCase();
  };

  // Show a simple placeholder during server-side rendering
  if (!isMounted) {
    return (
      <div className="flex space-x-4 py-4 animate-pulse bg-muted/20 rounded-md h-24"></div>
    );
  }

  // Ensure we have valid author information
  const username = author?.username || "Anonymous";
  const avatarUrl = author?.avatar || "";

  return (
    <div className="flex space-x-4 py-4">
      <Avatar className="h-10 w-10">
        <AvatarImage src={avatarUrl} alt={username} />
        <AvatarFallback>{getInitials(username)}</AvatarFallback>
      </Avatar>

      <div className="flex-1 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-semibold">{username}</span>
            <span className="text-muted-foreground text-xs">
              {formatRelativeTime(createdAt)}
              {updatedAt && updatedAt !== createdAt && (
                <span className="ml-1">(edited)</span>
              )}
            </span>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {isAuthor && onDelete && (
                <DropdownMenuItem
                  className="text-destructive cursor-pointer"
                  onClick={() => onDelete(id)}>
                  Delete
                </DropdownMenuItem>
              )}
              {!isAuthor && currentUser && onReport && (
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => onReport(id)}>
                  Report
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div
          className="text-sm"
          dangerouslySetInnerHTML={{
            __html: processedContent || content || "Empty comment",
          }}
        />

        <div className="flex items-center space-x-4 pt-1">
          <Button
            variant="ghost"
            size="sm"
            className={`h-8 px-2 text-xs space-x-1 ${
              isLiked ? "text-red-500" : ""
            }`}
            onClick={handleLike}>
            <Heart className="h-4 w-4" />
            <span>{likeCount > 0 ? likeCount : ""}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-xs space-x-1"
            onClick={handleReply}>
            <Reply className="h-4 w-4" />
            <span>Reply</span>
            {repliesCount > 0 && <span>({repliesCount})</span>}
          </Button>
        </div>
      </div>
    </div>
  );
}
