import { beforeAll } from "vitest";

beforeAll(() => {
  process.env.BETTER_AUTH_SECRET = process.env.BETTER_AUTH_SECRET ?? "ci-test-secret-longo";
  process.env.NEXT_PUBLIC_APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3001";
  process.env.GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID ?? "ci-placeholder";
  process.env.GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET ?? "ci-placeholder";
  
  console.log("DATABASE_URL:", process.env.DATABASE_URL ?? "NÃO DEFINIDA");
});