import { describe, it, expect } from "vitest";
import { auth } from "../src/lib/auth";

describe("F1 — Email + Senha", () => {
  const testEmail    = `user_${Date.now()}@example.com`;
  const testPassword = "Senha@Segura123";

  it("deve rejeitar senha menor que 8 caracteres", async () => {
    try {
      await auth.api.signUpEmail({
        body: { email: "teste@example.com", password: "123", name: "Teste" },
      });
      expect(true).toBe(false); // não deve chegar aqui
    } catch (e: any) {
      expect(e.message).toContain("short");
    }
  });

  it("deve criar usuário com email e senha válidos", async () => {
    const result = await auth.api.signUpEmail({
      body: { email: testEmail, password: testPassword, name: "Usuário Teste" },
    });
    expect(result?.user.email).toBe(testEmail);
  });

  it("deve fazer login com credenciais corretas", async () => {
    const result = await auth.api.signInEmail({
      body: { email: testEmail, password: testPassword },
      asResponse: false,
    });
    expect(result?.user.email).toBe(testEmail);
  });

  it("deve rejeitar login com senha errada", async () => {
    try {
      await auth.api.signInEmail({
        body: { email: testEmail, password: "senhaErrada" },
      });
      expect(true).toBe(false);
    } catch (e: any) {
      expect(e).toBeDefined();
    }
  });
});

describe("F3 — 2FA", () => {
  it("auth deve ter plugin twoFactor configurado", () => {
    const plugins = (auth as any).options?.plugins ?? [];
    const has2FA = plugins.some((p: any) => p.id === "two-factor");
    expect(has2FA).toBe(true);
  });
});

describe("F5 — Organização", () => {
  it("auth deve ter plugin organization configurado", () => {
    const plugins = (auth as any).options?.plugins ?? [];
    const hasOrg = plugins.some((p: any) => p.id === "organization");
    expect(hasOrg).toBe(true);
  });
});

describe("F7 — Admin", () => {
  it("auth deve ter plugin admin configurado", () => {
    const plugins = (auth as any).options?.plugins ?? [];
    const hasAdmin = plugins.some((p: any) => p.id === "admin");
    expect(hasAdmin).toBe(true);
  });
});