import { createAuthClient } from "better-auth/react";
import { twoFactorClient, organizationClient, adminClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3001",
  plugins: [
    twoFactorClient(),
    organizationClient(),
    adminClient(),
  ],
});

export const {
  signIn,
  signOut,
  signUp,
  useSession,
  getSession,
} = authClient;