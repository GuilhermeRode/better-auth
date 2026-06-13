# better-auth-showcase

Aplicação de demonstração completa do [Better Auth](https://github.com/better-auth/better-auth),
desenvolvida como projeto de software para a disciplina de **Engenharia de Software — 2025**.

---

## Sobre o projeto

Este repositório implementa um sistema de gestão de membros multi-tenant com autenticação avançada,
exercitando todos os principais plugins do Better Auth v1.x:

| Feature | Plugin Better Auth | Rota/Hook |
|---|---|---|
| F1 — Email + Senha | `emailAndPassword` | `POST /api/auth/sign-in/email` |
| F2 — Social OAuth (GitHub) | `socialProviders` | `GET /api/auth/callback/github` |
| F3 — 2FA TOTP | `twoFactor()` | `POST /api/auth/two-factor/enable` |
| F4 — Passkey / WebAuthn | `passkey()` | `POST /api/auth/passkey/register` |
| F5 — Multi-tenancy | `organization()` | `POST /api/auth/organization/create` |
| F6 — RBAC | `organization()` (roles) | verificado nos hooks de middleware |
| F7 — Painel Admin | `admin()` | `POST /api/auth/admin/impersonate-user` |

---

## Stack

```
Next.js 15 (App Router)   → Frontend + API Routes
Better Auth v1.x          → Auth core + plugins
Drizzle ORM               → Acesso ao banco, type-safe
PostgreSQL 16             → Banco de dados (via Docker)
Vitest 2.x                → Testes automatizados
GitHub Actions            → CI/CD
```

---

## Pré-requisitos

- Node.js 22+
- Docker + Docker Compose
- npm 10+

---

## Instalação e execução

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/better-auth-showcase.git
cd better-auth-showcase
```

### 2. Configure as variáveis de ambiente

```bash
cp .env.example .env
```

Edite `.env` e preencha:
- `BETTER_AUTH_SECRET` — gere com `openssl rand -base64 32`
- `GITHUB_CLIENT_ID` e `GITHUB_CLIENT_SECRET` — crie em [github.com/settings/applications/new](https://github.com/settings/applications/new)
  - Callback URL: `http://localhost:3000/api/auth/callback/github`

### 3. Suba o banco de dados

```bash
docker compose up -d
```

### 4. Instale as dependências

```bash
npm install
```

### 5. Gere e aplique o schema do banco

```bash
# Gera o schema Drizzle a partir da config do Better Auth
npm run auth:generate

# Aplica as migrations ao banco
npm run db:push
```

### 6. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

---

## Testes

```bash
# Executa todos os testes
npm run test

# Modo watch (desenvolvimento)
npm run test:watch

# Com relatório de cobertura
npm run test:coverage
```

Os testes usam o `testClient` do Better Auth, que roda em memória
sem precisar de banco externo — idêntico ao CI.

---

## Estrutura do projeto

```
better-auth-showcase/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── auth/
│   │   │       └── route.ts          # Catch-all handler do Better Auth
│   │   ├── dashboard/
│   │   │   └── page.tsx              # Área autenticada (Server Component)
│   │   └── auth/
│   │       └── sign-in/page.tsx      # Página de login
│   ├── lib/
│   │   ├── auth.ts                   # Config central do Better Auth
│   │   ├── auth-client.ts            # SDK cliente (React hooks)
│   │   └── db.ts                     # Conexão Drizzle + PostgreSQL
│   └── components/
│       └── auth/
│           ├── sign-in-form.tsx      # F1 + F2 + F4
│           └── organization-panel.tsx # F5 + F6
├── drizzle/
│   ├── schema.ts                     # Tabelas geradas pelo Better Auth CLI
│   └── migrations/                   # SQL gerado pelo Drizzle Kit
├── tests/
│   ├── setup.ts                      # Bootstrap do Vitest
│   └── auth.test.ts                  # Suite completa (F1–F7)
├── .github/
│   └── workflows/
│       └── ci.yml                    # GitHub Actions CI
├── docker-compose.yml                # PostgreSQL local
├── drizzle.config.ts                 # Config do Drizzle Kit
├── vitest.config.ts                  # Config do Vitest
└── .env.example                      # Template de variáveis
```

---

## Arquitetura

O projeto segue a mesma **Plugin Architecture** do Better Auth:

```
Aplicação Next.js (host)
        │
        ▼
Better Auth Core
  ┌─ Router (Web Standards Request/Response)
  ├─ Session Manager (cookies HTTP-only)
  └─ Plugin Runtime
        │
        ├── twoFactor()   → /api/auth/two-factor/*
        ├── passkey()     → /api/auth/passkey/*
        ├── organization()→ /api/auth/organization/*
        └── admin()       → /api/auth/admin/*
        │
        ▼
Drizzle ORM (adapter)
        │
        ▼
PostgreSQL
```

Cada plugin registra seus endpoints e hooks **sem modificar o core** —
implementação do princípio **Open/Closed** (SOLID).

---

## Atributos de qualidade (GQM)

| Atributo | Meta | Métrica |
|---|---|---|
| Segurança | CVEs tratados em < 7 dias | Histórico de security advisories |
| Extensibilidade | Plugin custom sem alterar core | Arquivos core modificados = 0 |
| Manutenibilidade | Cobertura de testes ≥ 70% | `npm run test:coverage` |
| Interoperabilidade | 6 frameworks + 5 ORMs suportados | Adapters oficiais com CI verde |

---

## Referências

- [Better Auth — Documentação oficial](https://www.better-auth.com)
- [Repositório GitHub](https://github.com/better-auth/better-auth)
- [Drizzle ORM](https://orm.drizzle.team)
- [Next.js 15](https://nextjs.org/docs)
- [Vitest](https://vitest.dev)
