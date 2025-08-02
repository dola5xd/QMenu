"use client";
import { useEffect } from "react";
import { Button } from "./_components/ui/button";

export default function GlobalError({ error }: { error: Error }) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <html>
      <body className="flex flex-col items-center justify-center min-h-screen p-6 bg-red-50">
        <h1 className="mb-4 text-4xl font-bold text-red-600">
          Unexpected Error
        </h1>
        <p className="mb-6 text-red-700">{error.message}</p>
        <Button onClick={() => location.assign("/")} variant={"destructive"}>
          Return Home
        </Button>
      </body>
    </html>
  );
}
