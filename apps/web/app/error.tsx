"use client";

import { Button } from "@fenamnow/ui/components/ui/button";
import { useEffect } from "react";

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <main className="flex h-screen w-full flex-col items-center justify-center space-y-12">
      <h2>Something went wrong!</h2>
      <p className="w-[40%] text-center">
        An error as encountered during the request. Please try again
      </p>
      <Button onClick={() => reset()}>Try again</Button>
    </main>
  );
}
