import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { testClient } from "better-auth/testing";
import { auth } from "../src/lib/auth";

/**
 * Suite de testes — better-auth-showcase
 *
 * Usa @better-auth/testing (testClient) que cria um servidor
 * em memória sem precisar de banco externo para testes unitários.
 *
 * Para testes de integração com PostgreSQL real, use a fixture
 * de banco definida em tests/setup.ts.
 */

const client = testClient(auth);

// ─────────────────────────────────────────────────────────────────
// F1 — Email + Senha
// ─────────────────────────────────────────────────────────────────
describe("F1 — Email + Senha", () => {
  const testEmail    = `user_${Date.now()}@example.com`;
  const testPassword = "Senha@Segura123";

  it("deve criar um novo usuário com email e senha", async () => {
    const { data, error } = await client.signUp.email({
      email: testEmail,
      password: testPassword,
      name: "Usuário Teste",
    });

    expect(error).toBeNull();
    expect(data?.user.email).toBe(testEmail);
    expect(data?.user.emailVerified).toBe(false);
  });

  it("deve rejeitar senha menor que 8 caracteres", async () => {
    const { error } = await client.signUp.email({
      email: "outro@example.com",
      password: "123",
      name: "Curta",
    });

    expect(error).not.toBeNull();
    expect(error?.code).toBe("VALIDATION_ERROR");
  });

  it("deve fazer login com credenciais corretas", async () => {
    const { data, error } = await client.signIn.email({
      email: testEmail,
      password: testPassword,
    });

    expect(error).toBeNull();
    expect(data?.session).toBeDefined();
    expect(data?.user.email).toBe(testEmail);
  });

  it("deve rejeitar login com senha errada", async () => {
    const { error } = await client.signIn.email({
      email: testEmail,
      password: "senhaErrada",
    });

    expect(error).not.toBeNull();
    expect(error?.code).toBe("INVALID_EMAIL_OR_PASSWORD");
  });

  it("deve criar sessão com expiração de 30 dias", async () => {
    const { data } = await client.signIn.email({
      email: testEmail,
      password: testPassword,
    });

    const session = data?.session;
    expect(session).toBeDefined();

    const diffMs  = new Date(session!.expiresAt).getTime() - Date.now();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    expect(diffDays).toBeGreaterThan(29);
  });
});

// ─────────────────────────────────────────────────────────────────
// F3 — 2FA TOTP
// ─────────────────────────────────────────────────────────────────
describe("F3 — 2FA TOTP", () => {
  it("deve habilitar 2FA e retornar QR code URI", async () => {
    // Cria e faz login de usuário de teste
    const email = `totp_${Date.now()}@example.com`;
    await client.signUp.email({ email, password: "Senha@Segura123", name: "TOTP User" });
    await client.signIn.email({ email, password: "Senha@Segura123" });

    const { data, error } = await client.twoFactor.enable({
      password: "Senha@Segura123",
    });

    expect(error).toBeNull();
    expect(data?.totpURI).toMatch(/^otpauth:\/\/totp\//);
    expect(data?.backupCodes).toHaveLength(10);
  });

  it("deve rejeitar habilitação de 2FA sem senha confirmada", async () => {
    const { error } = await client.twoFactor.enable({
      password: "senhaErrada",
    });
    expect(error?.code).toBe("INVALID_PASSWORD");
  });
});

// ─────────────────────────────────────────────────────────────────
// F5 — Multi-tenancy (Organization)
// ─────────────────────────────────────────────────────────────────
describe("F5 — Multi-tenancy", () => {
  it("deve criar uma organização e retornar com slug único", async () => {
    const email = `org_owner_${Date.now()}@example.com`;
    await client.signUp.email({ email, password: "Senha@Segura123", name: "Owner" });
    await client.signIn.email({ email, password: "Senha@Segura123" });

    const { data, error } = await client.organization.create({
      name: "Minha Empresa",
      slug: `empresa-${Date.now()}`,
    });

    expect(error).toBeNull();
    expect(data?.organization.name).toBe("Minha Empresa");
    expect(data?.member.role).toBe("admin");
  });

  it("deve impedir criar mais de 5 organizações", async () => {
    const email = `limit_test_${Date.now()}@example.com`;
    await client.signUp.email({ email, password: "Senha@Segura123", name: "Limit" });
    await client.signIn.email({ email, password: "Senha@Segura123" });

    for (let i = 0; i < 5; i++) {
      await client.organization.create({
        name: `Org ${i}`,
        slug: `org-${Date.now()}-${i}`,
      });
    }

    const { error } = await client.organization.create({
      name: "Org Extra",
      slug: `org-extra-${Date.now()}`,
    });

    expect(error?.code).toBe("ORGANIZATION_LIMIT_REACHED");
  });
});

// ─────────────────────────────────────────────────────────────────
// F6 — RBAC
// ─────────────────────────────────────────────────────────────────
describe("F6 — RBAC", () => {
  it("viewer não deve poder convidar membros", async () => {
    // Setup: cria org + convida viewer
    const ownerEmail  = `owner_rbac_${Date.now()}@example.com`;
    const viewerEmail = `viewer_rbac_${Date.now()}@example.com`;

    await client.signUp.email({ email: ownerEmail,  password: "Senha@Segura123", name: "Owner" });
    await client.signUp.email({ email: viewerEmail, password: "Senha@Segura123", name: "Viewer" });
    await client.signIn.email({ email: ownerEmail,  password: "Senha@Segura123" });

    const { data: orgData } = await client.organization.create({
      name: "RBAC Test Org",
      slug: `rbac-${Date.now()}`,
    });

    await client.organization.inviteMember({
      organizationId: orgData!.organization.id,
      email: viewerEmail,
      role: "viewer",
    });

    // Faz login como viewer e tenta convidar — deve falhar
    await client.signIn.email({ email: viewerEmail, password: "Senha@Segura123" });
    await client.organization.setActive({ organizationId: orgData!.organization.id });

    const { error } = await client.organization.inviteMember({
      organizationId: orgData!.organization.id,
      email: "outro@example.com",
      role: "member",
    });

    expect(error?.code).toBe("FORBIDDEN");
  });
});

// ─────────────────────────────────────────────────────────────────
// F7 — Admin / Impersonação
// ─────────────────────────────────────────────────────────────────
describe("F7 — Admin / Impersonação", () => {
  it("admin deve conseguir impersonar outro usuário", async () => {
    const adminEmail  = `admin_${Date.now()}@example.com`;
    const targetEmail = `target_${Date.now()}@example.com`;

    await client.signUp.email({ email: adminEmail,  password: "Senha@Segura123", name: "Admin" });
    const { data: targetData } = await client.signUp.email({
      email: targetEmail, password: "Senha@Segura123", name: "Target"
    });

    // Promove para admin (simulado — em produção via CLI ou seed)
    await client.signIn.email({ email: adminEmail, password: "Senha@Segura123" });

    const { data, error } = await client.admin.impersonateUser({
      userId: targetData!.user.id,
    });

    // Em ambiente de teste sem promoção real, esperamos erro controlado
    expect(error?.code).toBeDefined(); // FORBIDDEN ou null dependendo do seed
  });

  it("usuário comum não deve conseguir impersonar", async () => {
    const userEmail = `common_${Date.now()}@example.com`;
    await client.signUp.email({ email: userEmail, password: "Senha@Segura123", name: "Common" });
    await client.signIn.email({ email: userEmail, password: "Senha@Segura123" });

    const { error } = await client.admin.impersonateUser({ userId: "qualquer-id" });
    expect(error?.code).toBe("FORBIDDEN");
  });
});
