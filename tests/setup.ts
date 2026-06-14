import { beforeAll } from "vitest";

beforeAll(() => {
  // Define variáveis ANTES de qualquer import dinâmico
  process.env.BETTER_AUTH_SECRET ??= "ci-test-secret-longo-o-suficiente";
  process.env.NEXT_PUBLIC_APP_URL ??= "http://localhost:3001";
  process.env.AUTH_GITHUB_CLIENT_ID ??= "ci-placeholder";
  process.env.AUTH_GITHUB_CLIENT_SECRET ??= "ci-placeholder";
});