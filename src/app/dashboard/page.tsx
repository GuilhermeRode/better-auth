import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Página de dashboard — Server Component.
 * Verifica sessão no servidor antes de renderizar.
 */
export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/sign-in");
  }

  const { user } = session;

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Card de usuário */}
      <section className="bg-white rounded-lg border p-6 mb-6">
        <h2 className="text-lg font-semibold mb-3">Seu perfil</h2>
        <dl className="grid grid-cols-2 gap-2 text-sm">
          <dt className="text-gray-500">Nome</dt>
          <dd>{user.name}</dd>
          <dt className="text-gray-500">Email</dt>
          <dd>{user.email}</dd>
          <dt className="text-gray-500">Email verificado</dt>
          <dd>{user.emailVerified ? "Sim" : "Não"}</dd>
          <dt className="text-gray-500">Papel</dt>
          <dd className="capitalize">{user.role ?? "user"}</dd>
        </dl>
      </section>

      {/* Recursos de segurança */}
      <section className="bg-white rounded-lg border p-6">
        <h2 className="text-lg font-semibold mb-3">Segurança</h2>
        <div className="flex gap-3">
          <a href="/auth/two-factor" className="btn-secondary text-sm">
            Configurar 2FA
          </a>
          <a href="/auth/passkeys" className="btn-secondary text-sm">
            Gerenciar Passkeys
          </a>
        </div>
      </section>
    </main>
  );
}
