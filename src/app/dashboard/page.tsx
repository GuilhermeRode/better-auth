import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { SignOutButton } from "@/components/auth/sign-out-button";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/sign-in");
  }

  const { user } = session;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">B</span>
          </div>
          <span className="font-semibold text-gray-900">Better Auth Showcase</span>
        </div>
        <SignOutButton />
      </nav>

      {/* Conteúdo */}
      <main className="max-w-3xl mx-auto px-6 py-10 space-y-6">

        {/* Boas vindas */}
        <div className="bg-blue-600 rounded-2xl p-6 text-white">
          <p className="text-blue-100 text-sm mb-1">Bem-vindo de volta</p>
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <p className="text-blue-200 text-sm mt-1">{user.email}</p>
        </div>

        {/* Cards de info */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-xs text-gray-500 mb-1">Email verificado</p>
            <p className={`font-semibold ${user.emailVerified ? "text-green-600" : "text-red-500"}`}>
              {user.emailVerified ? "✓ Verificado" : "✗ Não verificado"}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-xs text-gray-500 mb-1">Papel</p>
            <p className="font-semibold text-gray-900 capitalize">{user.role ?? "user"}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-xs text-gray-500 mb-1">2FA</p>
            <p className={`font-semibold ${user.twoFactorEnabled ? "text-green-600" : "text-gray-400"}`}>
              {user.twoFactorEnabled ? "✓ Ativo" : "Não configurado"}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-xs text-gray-500 mb-1">ID do usuário</p>
            <p className="font-mono text-xs text-gray-600 truncate">{user.id}</p>
          </div>
        </div>

        {/* Links rápidos */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900 mb-3">Configurações</h2>
          <div className="space-y-2">
            <a href="/dashboard/sessions" className="flex items-center justify-between py-2 text-sm text-gray-700 hover:text-blue-600 transition">
              <span>Sessões ativas</span>
              <span>→</span>
            </a>
            <a href="/dashboard/two-factor" className="flex items-center justify-between py-2 text-sm text-gray-700 hover:text-blue-600 transition border-t border-gray-100">
              <span>Autenticação em dois fatores (2FA)</span>
              <span>→</span>
            </a>
            <a href="/dashboard/organizations" className="flex items-center justify-between py-2 text-sm text-gray-700 hover:text-blue-600 transition border-t border-gray-100">
              <span>Organizações</span>
              <span>→</span>
            </a>
          </div>
        </div>

      </main>
    </div>
  );
}