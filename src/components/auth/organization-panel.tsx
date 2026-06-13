"use client";

import { authClient } from "@/lib/auth-client";
import { useState } from "react";

/**
 * Componente de gestão de organizações — F5 (Multi-tenancy) + F6 (RBAC).
 * Usa o plugin organization() do Better Auth.
 */
export function OrganizationPanel() {
  const { data: activeOrg } = authClient.useActiveOrganization();
  const { data: orgs }      = authClient.useListOrganizations();
  const [newOrgName, setNewOrgName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole]   = useState<"member" | "viewer">("member");

  async function createOrg() {
    if (!newOrgName.trim()) return;
    await authClient.organization.create({
      name: newOrgName,
      slug: newOrgName.toLowerCase().replace(/\s+/g, "-"),
    });
    setNewOrgName("");
  }

  async function inviteMember() {
    if (!activeOrg || !inviteEmail) return;
    await authClient.organization.inviteMember({
      organizationId: activeOrg.id,
      email: inviteEmail,
      role: inviteRole,
    });
    setInviteEmail("");
  }

  async function switchOrg(orgId: string) {
    await authClient.organization.setActive({ organizationId: orgId });
  }

  return (
    <div className="space-y-6">
      {/* Lista de organizações */}
      <section className="bg-white rounded-lg border p-5">
        <h2 className="font-semibold mb-3">Suas organizações</h2>
        <ul className="space-y-2">
          {orgs?.map((org) => (
            <li
              key={org.id}
              className="flex items-center justify-between px-3 py-2 rounded border text-sm"
            >
              <span>{org.name}</span>
              <button
                onClick={() => switchOrg(org.id)}
                className={`text-xs px-2 py-1 rounded ${
                  activeOrg?.id === org.id
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                {activeOrg?.id === org.id ? "Ativa" : "Ativar"}
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* Criar nova organização */}
      <section className="bg-white rounded-lg border p-5">
        <h2 className="font-semibold mb-3">Criar organização</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Nome da organização"
            value={newOrgName}
            onChange={(e) => setNewOrgName(e.target.value)}
            className="flex-1 border rounded px-3 py-2 text-sm"
          />
          <button
            onClick={createOrg}
            className="bg-blue-600 text-white rounded px-4 py-2 text-sm"
          >
            Criar
          </button>
        </div>
      </section>

      {/* Convidar membro (F6 — RBAC) */}
      {activeOrg && (
        <section className="bg-white rounded-lg border p-5">
          <h2 className="font-semibold mb-3">
            Convidar para: <span className="text-blue-600">{activeOrg.name}</span>
          </h2>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Email do convidado"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="flex-1 border rounded px-3 py-2 text-sm"
            />
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value as "member" | "viewer")}
              className="border rounded px-3 py-2 text-sm"
            >
              <option value="member">Member</option>
              <option value="viewer">Viewer</option>
            </select>
            <button
              onClick={inviteMember}
              className="bg-green-600 text-white rounded px-4 py-2 text-sm"
            >
              Convidar
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
