import { describe, it, expect } from "vitest";

/**
 * Testes de unidade — não precisam de banco.
 */
describe("Configuração dos plugins", () => {
  it("deve ter emailAndPassword habilitado", async () => {
    const { auth } = await import("../src/lib/auth");
    const options = (auth as any).options;
    expect(options?.emailAndPassword?.enabled).toBe(true);
  });

  it("deve ter plugin twoFactor configurado", async () => {
    const { auth } = await import("../src/lib/auth");
    const plugins = (auth as any).options?.plugins ?? [];
    const has2FA = plugins.some((p: any) => p.id === "two-factor");
    expect(has2FA).toBe(true);
  });

  it("deve ter plugin organization configurado", async () => {
    const { auth } = await import("../src/lib/auth");
    const plugins = (auth as any).options?.plugins ?? [];
    const hasOrg = plugins.some((p: any) => p.id === "organization");
    expect(hasOrg).toBe(true);
  });

  it("deve ter plugin admin configurado", async () => {
    const { auth } = await import("../src/lib/auth");
    const plugins = (auth as any).options?.plugins ?? [];
    const hasAdmin = plugins.some((p: any) => p.id === "admin");
    expect(hasAdmin).toBe(true);
  });

  it("deve ter socialProviders com github", async () => {
    const { auth } = await import("../src/lib/auth");
    const options = (auth as any).options;
    expect(options?.socialProviders?.github).toBeDefined();
  });
});

/**
 * Testes de integração — só rodam se DATABASE_URL estiver definida.
 */
const hasDB = !!process.env.DATABASE_URL && !process.env.DATABASE_URL.includes("5433");

describe.skipIf(!hasDB)("F1 — Email + Senha (requer banco)", () => {
  const testEmail    = `user_${Date.now()}@example.com`;
  const testPassword = "Senha@Segura123";

  it("deve rejeitar senha menor que 8 caracteres", async () => {
    const { auth } = await import("../src/lib/auth");
    try {
      await auth.api.signUpEmail({
        body: { email: "teste@example.com", password: "123", name: "Teste" },
      });
      expect(true).toBe(false);
    } catch (e: any) {
      expect(e.message).toContain("short");
    }
  });

  it("deve criar usuário com email e senha válidos", async () => {
    const { auth } = await import("../src/lib/auth");
    const result = await auth.api.signUpEmail({
      body: { email: testEmail, password: testPassword, name: "Usuário Teste" },
    });
    expect(result?.user.email).toBe(testEmail);
  });

  it("deve fazer login com credenciais corretas", async () => {
    const { auth } = await import("../src/lib/auth");
    const result = await auth.api.signInEmail({
      body: { email: testEmail, password: testPassword },
      asResponse: false,
    });
    expect(result?.user.email).toBe(testEmail);
  });
});