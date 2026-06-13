import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { twoFactor } from "better-auth/plugins/two-factor";
import { passkey } from "better-auth/plugins/passkey";
import { organization } from "better-auth/plugins/organization";
import { admin } from "better-auth/plugins/admin";
import { openAPI } from "better-auth/plugins/open-api";
import { db } from "./db";

/**
 * Instância principal do Better Auth.
 * Padrão: Plugin Architecture + Hook System
 * Cada plugin registra endpoints e hooks no runtime
 * sem modificar o core — princípio Open/Closed.
 */
export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg" }),

  // F1 — Email + Senha
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    minPasswordLength: 8,
  },

  // F2 — Social OAuth (GitHub)
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 30,
    updateAge: 60 * 60 * 24 * 7,
    cookieCache: { enabled: true, maxAge: 60 * 5 },
  },

  plugins: [
    // F3 — 2FA TOTP (Google Authenticator)
    twoFactor({
      issuer: "BetterAuthShowcase",
      totpOptions: { period: 30, digits: 6 },
    }),

    // F4 — Passkey / WebAuthn
    passkey({
      rpName: "Better Auth Showcase",
      rpID: process.env.NEXT_PUBLIC_APP_URL
        ? new URL(process.env.NEXT_PUBLIC_APP_URL).hostname
        : "localhost",
      origin: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
    }),

    // F5 + F6 — Multi-tenancy + RBAC
    organization({
      allowUserToCreateOrganization: true,
      organizationLimit: 5,
      membershipLimit: 100,
      roles: {
        admin:  { permissions: ["*"] },
        member: { permissions: ["organization:read", "members:read", "invitations:create"] },
        viewer: { permissions: ["organization:read", "members:read"] },
      },
    }),

    // F7 — Painel admin com impersonação
    admin({ impersonationSessionDuration: 60 * 60 }),

    openAPI(),
  ],

  rateLimit: { window: 60, max: 20, storage: "memory" },
  trustedOrigins: [process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"],
});

export type Session = typeof auth.$Infer.Session;
export type User    = typeof auth.$Infer.Session.user;
