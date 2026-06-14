"use client";

import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function OrganizationPanel() {
  const router = useRouter();
  const { data: orgs, isPending } = authClient.useListOrganizations();
  const { data: activeOrg }       = authClient.useActiveOrganization();

  const [newOrgName, setNewOrgName]   = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"member" | "admin">("member");
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState<string | null>(null);
  const [success, setSuccess]         = useState<string | null>(null);

  async function createOrg() {
    if (!newOrgName.trim()) return;
    setLoading(true);
    setError(null);

    const result = await authClient.organization.create({
      name: newOrgName,
      slug: newOrgName.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
    });

    if (result.error) {
      setError(result.error.message ?? "Erro ao criar organização.");
    } else {
      setSuccess("Organização criada!");
      setNewOrgName("");
      router.refresh();
    }
    setLoading(false);
  }

  async function switchOrg(orgId: string) {
    await authClient.organization.setActive({ organizationId: orgId });
    router.refresh();
  }

  async function inviteMember() {
    if (!activeOrg || !inviteEmail) return;
    setLoading(true);
    setError(null);

    const result = await authClient.organization.inviteMember({
      organizationId: activeOrg.id,
      email: inviteEmail,
      role: inviteRole,
    });

    if (result.error) {
      setError(result.error.message ?? "Erro ao convidar membro.");
    } else {
      setSuccess(`Convite enviado para ${inviteEmail}!`);
      setInviteEmail("");
    }
    setLoading(false);
  }

  if (isPending) {
    return <div className="text-sm text-gray-500">Carregando...</div>;
  }

  return (
    <div className="space-y-6">

      {/* Feedback */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg text-sm">
          {success}
        </div>
      )}

      {/* Lista de organizações */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="font-semibold text-gray-900 mb-3">Suas organizações</h2>
        {orgs && orgs.length > 0 ? (
          <ul className="space-y-2">
            {orgs.map((org) => (
              <li key={org.id} className="flex items-center justify-between px-3 py-2 rounded-lg border border-gray-100 text-sm">
                <span className="font-medium text-gray-800">{org.name}</span>
                <button
                  onClick={() => switchOrg(org.id)}
                  className={`text-xs px-3 py-1 rounded-full font-medium transition ${
                    activeOrg?.id === org.id
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  {activeOrg?.id === org.id ? "✓ Ativa" : "Ativar"}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-400">Nenhuma organização ainda.</p>
        )}
      </div>

      {/* Criar organização */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="font-semibold text-gray-900 mb-3">Criar organização</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Nome da organização"
            value={newOrgName}
            onChange={(e) => setNewOrgName(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={createOrg}
            disabled={loading || !newOrgName.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 text-sm font-medium transition disabled:opacity-50"
          >
            Criar
          </button>
        </div>
      </div>

      {/* Convidar membro */}
      {activeOrg && (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900 mb-1">Convidar membro</h2>
          <p className="text-xs text-gray-400 mb-3">
            Organização ativa: <span className="font-medium text-blue-600">{activeOrg.name}</span>
          </p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="email@exemplo.com"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value as "member" | "admin")}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none"
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
            <button
              onClick={inviteMember}
              disabled={loading || !inviteEmail}
              className="bg-green-600 hover:bg-green-700 text-white rounded-lg px-4 py-2 text-sm font-medium transition disabled:opacity-50"
            >
              Convidar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}