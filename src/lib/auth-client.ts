import { createAuthClient } from "better-auth/react";
import { twoFactorClient } from "better-auth/client/plugins";
import { passkeyClient } from "better-auth/client/plugins";
import { organizationClient } from "better-auth/client/plugins";
import { adminClient } from "better-auth/client/plugins";

/**
 * Cliente Better Auth para o browser.
 * Expõe hooks React: useSession, signIn, signOut, etc.
 */
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  plugins: [
    twoFactorClient(),
    passkeyClient(),
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
