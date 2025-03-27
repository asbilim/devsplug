"use client";

import { useState, useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

interface CommentsErrorBoundaryProps {
  children: React.ReactNode;
}

export function CommentsErrorBoundary({
  children,
}: CommentsErrorBoundaryProps) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error("Comments section error:", event.error);
      setHasError(true);
    };

    window.addEventListener("error", handleError);
    return () => window.removeEventListener("error", handleError);
  }, []);

  if (hasError) {
    return (
      <Alert variant="destructive" className="my-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error loading comments</AlertTitle>
        <AlertDescription>
          There was an error loading the comments section.
          <Button
            variant="outline"
            size="sm"
            className="ml-2"
            onClick={() => {
              setHasError(false);
              window.location.reload();
            }}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return children;
}
