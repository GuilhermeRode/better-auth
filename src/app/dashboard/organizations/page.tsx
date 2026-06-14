import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { OrganizationPanel } from "@/components/auth/organization-panel";

export default async function OrganizationsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/auth/sign-in");

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
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Organizações</h1>
        <p className="text-gray-500 text-sm mb-6">
          Crie e gerencie organizações. Convide membros com papéis diferentes.
        </p>
        <OrganizationPanel />
      </main>
    </div>
  );
}