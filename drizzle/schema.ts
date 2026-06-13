import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  uuid,
} from "drizzle-orm/pg-core";

// ── Tabela de usuários ──────────────────────────────────────────
export const user = pgTable("user", {
  id:            text("id").primaryKey(),
  name:          text("name").notNull(),
  email:         text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image:         text("image"),
  createdAt:     timestamp("created_at").notNull().defaultNow(),
  updatedAt:     timestamp("updated_at").notNull().defaultNow(),

  // Plugin: admin
  role:    text("role").default("user"),
  banned:  boolean("banned").default(false),
  banReason: text("ban_reason"),
  banExpires: timestamp("ban_expires"),

  // Plugin: twoFactor
  twoFactorEnabled: boolean("two_factor_enabled").default(false),
});

// ── Sessões ─────────────────────────────────────────────────────
export const session = pgTable("session", {
  id:                   text("id").primaryKey(),
  expiresAt:            timestamp("expires_at").notNull(),
  token:                text("token").notNull().unique(),
  createdAt:            timestamp("created_at").notNull().defaultNow(),
  updatedAt:            timestamp("updated_at").notNull().defaultNow(),
  ipAddress:            text("ip_address"),
  userAgent:            text("user_agent"),
  userId:               text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),

  // Plugin: admin (impersonação)
  impersonatedBy: text("impersonated_by"),

  // Plugin: organization
  activeOrganizationId: text("active_organization_id"),
});

// ── Contas OAuth ─────────────────────────────────────────────────
export const account = pgTable("account", {
  id:                    text("id").primaryKey(),
  accountId:             text("account_id").notNull(),
  providerId:            text("provider_id").notNull(),
  userId:                text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  accessToken:           text("access_token"),
  refreshToken:          text("refresh_token"),
  idToken:               text("id_token"),
  accessTokenExpiresAt:  timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope:                 text("scope"),
  password:              text("password"),
  createdAt:             timestamp("created_at").notNull().defaultNow(),
  updatedAt:             timestamp("updated_at").notNull().defaultNow(),
});

// ── Verificações (email, reset de senha) ────────────────────────
export const verification = pgTable("verification", {
  id:         text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value:      text("value").notNull(),
  expiresAt:  timestamp("expires_at").notNull(),
  createdAt:  timestamp("created_at").defaultNow(),
  updatedAt:  timestamp("updated_at").defaultNow(),
});

// ── Plugin: twoFactor ───────────────────────────────────────────
export const twoFactor = pgTable("two_factor", {
  id:          text("id").primaryKey(),
  secret:      text("secret").notNull(),
  backupCodes: text("backup_codes").notNull(),
  userId:      text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
});

// ── Plugin: passkey ─────────────────────────────────────────────
export const passkey = pgTable("passkey", {
  id:                    text("id").primaryKey(),
  name:                  text("name"),
  publicKey:             text("public_key").notNull(),
  userId:                text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  credentialID:          text("credential_i_d").notNull(),
  counter:               integer("counter").notNull(),
  deviceType:            text("device_type").notNull(),
  backedUp:              boolean("backed_up").notNull(),
  transports:            text("transports"),
  createdAt:             timestamp("created_at").defaultNow(),
  aaguid:                text("aaguid"),
});

// ── Plugin: organization ────────────────────────────────────────
export const organization = pgTable("organization", {
  id:        text("id").primaryKey(),
  name:      text("name").notNull(),
  slug:      text("slug").unique(),
  logo:      text("logo"),
  metadata:  text("metadata"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const member = pgTable("member", {
  id:             text("id").primaryKey(),
  organizationId: text("organization_id").notNull().references(() => organization.id, { onDelete: "cascade" }),
  userId:         text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  role:           text("role").notNull().default("member"), // admin | member | viewer
  createdAt:      timestamp("created_at").notNull().defaultNow(),
});

export const invitation = pgTable("invitation", {
  id:             text("id").primaryKey(),
  organizationId: text("organization_id").notNull().references(() => organization.id, { onDelete: "cascade" }),
  email:          text("email").notNull(),
  role:           text("role"),
  status:         text("status").notNull().default("pending"),
  expiresAt:      timestamp("expires_at").notNull(),
  inviterId:      text("inviter_id").notNull().references(() => user.id, { onDelete: "cascade" }),
});
