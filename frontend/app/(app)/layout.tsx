import type { ReactNode } from "react";

import { AuthProvider } from "@/app/providers/AuthProvider";
import AppShell from "@/app/components/layout/AppShell";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <AppShell>{children}</AppShell>
    </AuthProvider>
  );
}


