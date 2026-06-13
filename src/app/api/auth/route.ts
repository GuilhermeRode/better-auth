import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

/**
 * Catch-all route handler do Better Auth.
 *
 * Todas as rotas de auth são servidas aqui:
 *   POST /api/auth/sign-in/email
 *   POST /api/auth/sign-up/email
 *   GET  /api/auth/session
 *   POST /api/auth/sign-out
 *   POST /api/auth/two-factor/enable
 *   GET  /api/auth/passkey/register
 *   POST /api/auth/organization/create
 *   ... +50 endpoints gerados automaticamente pelos plugins
 */
export const { GET, POST } = toNextJsHandler(auth);
