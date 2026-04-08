"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import { syncUserToD1 } from "@/auth";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

// 内部组件处理用户同步
function UserSyncHandler({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      // 调用API同步用户到D1
      fetch("/api/user/sync", { method: "POST" }).catch(console.error);
    }
  }, [status, session]);

  return <>{children}</>;
}

export function SessionProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextAuthSessionProvider>
      <UserSyncHandler>{children}</UserSyncHandler>
    </NextAuthSessionProvider>
  );
}