"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/app/providers/AuthProvider";

export default function AuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, refreshToken } = useAuth();

  useEffect(() => {
    let cancelled = false;

    async function ensureAuth() {
      // If we already have access token, allow render.
      if (isAuthenticated) return;

      // Attempt refresh if we have a refresh token.
      try {
        await refreshToken();
      } catch {
        // ignore; we'll redirect below
      }

      if (cancelled) return;
      if (!isAuthenticated) {
        router.replace("/login");
      }
    }

    ensureAuth();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isAuthenticated) return null;
  return <>{children}</>;
}

