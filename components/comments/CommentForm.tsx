"use client";

import { useState, useTransition, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createComment } from "@/app/actions/comments";
import { validateCommentContent } from "@/lib/comment-utils";
import { AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { User } from "next-auth";
import { useRouter } from "next/navigation";

interface CommentFormProps {
  challengeSlug: string;
  solutionId: string | number;
  parentId?: string | number;
  user: User | null;
  onSuccess?: (content: string, parentId?: string | number) => void;
  onCancel?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
  isReply?: boolean;
}

export function CommentForm({
  challengeSlug,
  solutionId,
  parentId = 0,
  user,
  onSuccess,
  onCancel,
  placeholder = "Share your thoughts...",
  autoFocus = false,
  isReply = false,
}: CommentFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  // Handle client-side only code in useEffect to prevent hydration errors
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<{ content: string }>({
    defaultValues: {
      content: "",
    },
  });

  // Don't render anything until the component is mounted on the client
  // This prevents hydration errors with dynamic content
  if (!isMounted) {
    return (
      <div className="min-h-[100px] rounded-md border border-input bg-muted/30"></div>
    );
  }

  if (!user) {
    return (
      <div className="p-4 bg-muted/50 rounded-md">
        <p className="text-sm text-muted-foreground">
          Please{" "}
          <Button
            variant="link"
            className="p-0 h-auto"
            onClick={() => router.push("/login")}>
            sign in
          </Button>{" "}
          to join the discussion.
        </p>
      </div>
    );
  }

  const onSubmit = async (data: { content: string }) => {
    setError(null);

    // Ensure content is a string
    const content = data.content ? String(data.content) : "";

    // Validate the comment content
    const validationResult = validateCommentContent(content);
    if (!validationResult.isValid) {
      setError(validationResult.error || "Invalid comment content");
      return;
    }

    startTransition(async () => {
      try {
        await createComment({
          content: content,
          challengeSlug,
          solutionId: solutionId.toString(),
          parentId: parentId ? parentId.toString() : "0",
        });

        // Call onSuccess with the content and parentId
        if (onSuccess) onSuccess(content, parentId);

        reset();
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to post comment. Please try again.");
        }
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Textarea
        {...register("content", {
          required: "Comment cannot be empty",
          maxLength: {
            value: 2000,
            message: "Comment is too long (maximum 2000 characters)",
          },
        })}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="min-h-[100px] resize-y"
        disabled={isPending}
      />

      {errors.content && (
        <p className="text-destructive text-sm">{errors.content.message}</p>
      )}

      <div className="flex justify-end space-x-2">
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            disabled={isPending}>
            Cancel
          </Button>
        )}

        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Posting...
            </>
          ) : (
            "Post"
          )}
        </Button>
      </div>
    </form>
  );
}
