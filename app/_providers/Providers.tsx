"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#1c1c1c",
            color: "#fef8e8",
            border: "1px solid #3a3a3a",
            padding: "12px 16px",
            fontSize: "0.875rem",
          },
          success: {
            iconTheme: { primary: "#4ade80", secondary: "#1c1c1c" },
          },
          error: {
            iconTheme: { primary: "#ef4444", secondary: "#1c1c1c" },
          },
        }}
      />
    </SessionProvider>
  );
}
