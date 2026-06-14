import { describe, it, expect } from "vitest";
import { auth } from "../src/lib/auth";

/**
 * Testes de unidade — verificam configuração dos plugins.
 * Não precisam de banco de dados.
 */
describe("Configuração do Better Auth", () => {
  it("deve ter emailAndPassword habilitado", () => {
    const options = (auth as any).options;
    expect(options?.emailAndPassword?.enabled).toBe(true);
  });

  it("deve ter minPasswordLength de 8", () => {
    const options = (auth as any).options;
    expect(options?.emailAndPassword?.minPasswordLength).toBe(8);
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
    const options = (auth as any).options;
    expect(options?.socialProviders?.github).toBeDefined();
  });

  it("deve ter rateLimit configurado", () => {
    const options = (auth as any).options;
    expect(options?.rateLimit?.window).toBe(60);
    expect(options?.rateLimit?.max).toBe(20);
  });
});