"use client";

import { useEffect } from "react";
import Button from "@/components/ui/Button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-bg-primary text-text-primary px-4">
      <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
      <p className="text-text-secondary mb-8 text-center max-w-md">{error.message}</p>
      <Button onClick={() => reset()}>Try again</Button>
    </div>
  );
}
