import { betterAuth } from "better-auth";
import { Pool } from "pg";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { drizzle } from "drizzle-orm/node-postgres";
import { twoFactor, organization, admin, openAPI } from "better-auth/plugins";
import * as schema from "../../auth-schema";

const pool = new Pool({
  host: "localhost",
  port: 5433,
  user: "postgres",
  password: "123456",
  database: "better_auth_showcase",
  ssl: false,
});

const db = drizzle(pool, { schema });

export const auth = betterAuth({
  database: drizzleAdapter(db, { 
    provider: "pg",
    schema,
  }),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    minPasswordLength: 8,
  },

  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 30,
    updateAge: 60 * 60 * 24 * 7,
  },

  plugins: [
    twoFactor({
      issuer: "BetterAuthShowcase",
      totpOptions: { period: 30, digits: 6 },
    }),
    organization({
      allowUserToCreateOrganization: true,
      organizationLimit: 5,
      membershipLimit: 100,
    }),
    admin({ impersonationSessionDuration: 60 * 60 }),
    openAPI(),
  ],

  rateLimit: { window: 60, max: 20, storage: "memory" },
  trustedOrigins: [process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"],
});

export type Session = typeof auth.$Infer.Session;
export type User    = typeof auth.$Infer.Session.user;