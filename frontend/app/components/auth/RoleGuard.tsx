"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/app/providers/AuthProvider";

export default function RoleGuard({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles: string[];
}) {
  const router = useRouter();
  const { userRole } = useAuth();

  useEffect(() => {
    if (!userRole) return;
    if (!allowedRoles.includes(userRole)) {
      router.replace("/login");
    }
  }, [allowedRoles, router, userRole]);

  if (!userRole) return null;
  if (!allowedRoles.includes(userRole)) return null;
  return <>{children}</>;
}

