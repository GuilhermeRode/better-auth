import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { RevokeSessionButton } from "@/components/auth/revoke-session-button";

export default async function SessionsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/auth/sign-in");

  const sessions = await auth.api.listSessions({
    headers: await headers(),
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">B</span>
          </div>
          <span className="font-semibold text-gray-900">Better Auth Showcase</span>
        </div>
        <a href="/dashboard" className="text-sm text-gray-500 hover:text-blue-600 transition">
          ← Voltar
        </a>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Sessões ativas</h1>
        <p className="text-gray-500 text-sm mb-6">Gerencie todos os dispositivos conectados à sua conta.</p>

        <div className="space-y-3">
          {sessions.map((s) => (
            <div key={s.id} className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-gray-900">
                    {s.userAgent?.includes("Chrome") ? "Chrome" :
                     s.userAgent?.includes("Firefox") ? "Firefox" :
                     s.userAgent?.includes("Safari") ? "Safari" : "Navegador"}
                  </span>
                  {s.id === session.session.id && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                      Sessão atual
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400">
                  IP: {s.ipAddress ?? "Desconhecido"} · Expira em: {new Date(s.expiresAt).toLocaleDateString("pt-BR")}
                </p>
              </div>
              {s.id !== session.session.id && (
                <RevokeSessionButton token={s.token} />
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}