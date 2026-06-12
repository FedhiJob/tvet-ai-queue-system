"use client";

import type { ReactNode } from "react";
import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { login as apiLogin, refreshToken as apiRefreshToken, type AuthTokens } from "@/app/services/auth.service";

type UserRole = string;

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  role: UserRole | null;
};

type AuthContextValue = {
  userRole: UserRole | null;
  accessToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function getStoredAccessToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("access_token");
}

function getStoredRefreshToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("refresh_token");
}

function getStoredRole() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("role");
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(getStoredAccessToken());
  const [refreshToken, setRefreshToken] = useState<string | null>(getStoredRefreshToken());
  const [role, setRole] = useState<UserRole | null>(getStoredRole());

  const persist = useCallback((tokens: AuthTokens, newRole: UserRole | null) => {
    if (typeof window === "undefined") return;

    window.localStorage.setItem("access_token", tokens.access_token);
    window.localStorage.setItem("refresh_token", tokens.refresh_token);
    if (newRole) window.localStorage.setItem("role", newRole);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const tokens = await apiLogin({ email, password });
    // We don't decode JWT here; backend returns role inside token payload.
    // Store role from existing state or leave null for now.
    setAccessToken(tokens.access_token);
    setRefreshToken(tokens.refresh_token);
    persist(tokens, role);
  }, [persist, role]);

  const logout = useCallback(() => {
    setAccessToken(null);
    setRefreshToken(null);
    setRole(null);

    if (typeof window !== "undefined") {
      window.localStorage.removeItem("access_token");
      window.localStorage.removeItem("refresh_token");
      window.localStorage.removeItem("role");
    }
  }, []);

  const refresh = useCallback(async () => {
    if (!refreshToken) return;

    const tokens = await apiRefreshToken({ refresh_token: refreshToken });
    setAccessToken(tokens.access_token);
    setRefreshToken(tokens.refresh_token);
    persist(tokens, role);
  }, [persist, refreshToken, role]);

  const value = useMemo<AuthContextValue>(
    () => ({
      userRole: role,
      accessToken,
      isAuthenticated: !!accessToken,
      login,
      logout,
      refreshToken: refresh,
    }),
    [accessToken, login, logout, refresh, role]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

