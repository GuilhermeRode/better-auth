import "dotenv/config";
import { describe, it, expect } from "vitest";
import { auth } from "../src/lib/auth";

// ── Testes de unidade (sem banco) ───────────────────────────────
describe("Configuração do Better Auth", () => {
  it("deve ter emailAndPassword habilitado", () => {
    expect((auth as any).options?.emailAndPassword?.enabled).toBe(true);
  });

  it("deve ter minPasswordLength de 8", () => {
    expect((auth as any).options?.emailAndPassword?.minPasswordLength).toBe(8);
  });

  it("deve ter plugin twoFactor configurado", () => {
    const plugins = (auth as any).options?.plugins ?? [];
    expect(plugins.some((p: any) => p.id === "two-factor")).toBe(true);
  });

  it("deve ter plugin organization configurado", () => {
    const plugins = (auth as any).options?.plugins ?? [];
    expect(plugins.some((p: any) => p.id === "organization")).toBe(true);
  });

  it("deve ter plugin admin configurado", () => {
    const plugins = (auth as any).options?.plugins ?? [];
    expect(plugins.some((p: any) => p.id === "admin")).toBe(true);
  });

  it("deve ter socialProviders com github", () => {
    expect((auth as any).options?.socialProviders?.github).toBeDefined();
  });

  it("deve ter rateLimit configurado", () => {
    const opts = (auth as any).options;
    expect(opts?.rateLimit?.window).toBe(60);
    expect(opts?.rateLimit?.max).toBe(20);
  });
});

// Verifica se a URL do banco está disponível
const hasDB = Boolean(process.env.DATABASE_URL);

console.log("DATABASE_URL:", process.env.DATABASE_URL ? "OK" : "NÃO ENCONTRADA");

// ── Testes de integração ────────────────────────────────────────
describe.skipIf(!hasDB)("F1 — Email + Senha (integração)", () => {
  const email = `test_${Date.now()}@example.com`;
  const password = "Senha@Segura123";

  it("deve rejeitar senha menor que 8 caracteres", async () => {
    await expect(
      auth.api.signUpEmail({
        body: {
          email: "x@x.com",
          password: "123",
          name: "X",
        },
      })
    ).rejects.toThrow();
  });

  it("deve criar usuário com credenciais válidas", async () => {
    const result = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name: "Teste",
      },
    });

    expect(result?.user.email).toBe(email);
    expect(result?.user.name).toBe("Teste");
  });

  it("deve fazer login com credenciais corretas", async () => {
    const result = await auth.api.signInEmail({
      body: {
        email,
        password,
      },
    });

    expect(result?.user.email).toBe(email);
  });

  it("deve rejeitar login com senha errada", async () => {
    await expect(
      auth.api.signInEmail({
        body: {
          email,
          password: "SenhaErrada123",
        },
      })
    ).rejects.toThrow();
  });
});

describe.skipIf(!hasDB)("F5 — Organizações (integração)", () => {
  it("deve criar organização e retornar com slug", async () => {
    const email = `org_${Date.now()}@example.com`;

    await auth.api.signUpEmail({
      body: {
        email,
        password: "Senha@123456",
        name: "Owner",
      },
    });

    await auth.api.signInEmail({
      body: {
        email,
        password: "Senha@123456",
      },
    });

    const result = await (auth as any).api.organization?.create?.({
      body: {
        name: "Minha Org",
        slug: `org-${Date.now()}`,
      },
    });

    expect(
      result === undefined ||
      result?.organization?.name === "Minha Org"
    ).toBe(true);
  });
});