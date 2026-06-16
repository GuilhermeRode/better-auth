import "dotenv/config";
import { describe, it, expect } from "vitest";
import { auth } from "../src/lib/auth";

//Testes de unidade (sem banco) 
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

// Teste de integração 
const hasDB = Boolean(process.env.DATABASE_URL);

describe.skipIf(!hasDB)("F1 — Email + Senha (integração)", () => {
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
});

