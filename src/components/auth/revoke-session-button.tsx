"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export function RevokeSessionButton({ token }: { token: string }) {
  const router = useRouter();

  async function handleRevoke() {
    await authClient.revokeSession({ token });
    router.refresh();
  }

  return (
    <button
      onClick={handleRevoke}
      className="text-xs text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 px-3 py-1.5 rounded-lg transition"
    >
      Revogar
    </button>
  );
}