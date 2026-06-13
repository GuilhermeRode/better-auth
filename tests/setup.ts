import { beforeAll, afterAll } from "vitest";

/**
 * Setup global para todos os testes.
 * O testClient do Better Auth usa SQLite em memória
 * automaticamente quando DATABASE_URL não está definida.
 */

beforeAll(async () => {
  // Garante que variáveis de ambiente de teste existem
  process.env.BETTER_AUTH_SECRET = "test-secret-for-vitest-only";
  process.env.NEXT_PUBLIC_APP_URL = "http://localhost:3000";
  process.env.GITHUB_CLIENT_ID = "test-github-id";
  process.env.GITHUB_CLIENT_SECRET = "test-github-secret";
});

afterAll(async () => {
  // Cleanup se necessário
});
