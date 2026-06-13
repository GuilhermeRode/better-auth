"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export function TwoFactorSetup({ enabled }: { enabled: boolean }) {
  const router = useRouter();
  const [step, setStep]         = useState<"idle" | "qr" | "verify">("idle");
  const [password, setPassword] = useState("");
  const [totpURI, setTotpURI]   = useState("");
  const [code, setCode]         = useState("");
  const [error, setError]       = useState<string | null>(null);
  const [loading, setLoading]   = useState(false);

  async function handleEnable() {
    if (!password) return;
    setLoading(true);
    setError(null);

    const result = await authClient.twoFactor.enable({ password });

    if (result.error) {
      setError(result.error.message ?? "Erro ao habilitar 2FA.");
    } else {
      setTotpURI(result.data?.totpURI ?? "");
      setStep("qr");
    }
    setLoading(false);
  }

  async function handleVerify() {
    setLoading(true);
    setError(null);

    const result = await authClient.twoFactor.verifyTotp({ code });

    if (result.error) {
      setError("Código inválido. Tente novamente.");
    } else {
      router.refresh();
      setStep("idle");
    }
    setLoading(false);
  }

  async function handleDisable() {
    setLoading(true);
    const result = await authClient.twoFactor.disable({ password });
    if (result.error) {
      setError(result.error.message ?? "Erro ao desabilitar.");
    } else {
      router.refresh();
    }
    setLoading(false);
  }

  if (enabled) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <span className="text-green-600 text-lg">✓</span>
          </div>
          <div>
            <p className="font-semibold text-gray-900">2FA está ativo</p>
            <p className="text-sm text-gray-500">Sua conta está protegida com autenticação em dois fatores.</p>
          </div>
        </div>
        <div className="border-t border-gray-100 pt-4">
          <p className="text-sm text-gray-600 mb-3">Digite sua senha para desabilitar o 2FA:</p>
          <input
            type="password"
            placeholder="Sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
          <button
            onClick={handleDisable}
            disabled={loading}
            className="bg-red-500 hover:bg-red-600 text-white rounded-lg px-4 py-2 text-sm font-medium transition disabled:opacity-50"
          >
            {loading ? "Desabilitando..." : "Desabilitar 2FA"}
          </button>
        </div>
      </div>
    );
  }

  if (step === "idle") {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <p className="text-sm text-gray-600 mb-4">
          Digite sua senha para começar a configuração do 2FA:
        </p>
        <input
          type="password"
          placeholder="Sua senha atual"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        <button
          onClick={handleEnable}
          disabled={loading || !password}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 text-sm font-medium transition disabled:opacity-50"
        >
          {loading ? "Gerando QR Code..." : "Gerar QR Code"}
        </button>
      </div>
    );
  }

  if (step === "qr") {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
          <p className="font-medium mb-1">Como configurar:</p>
          <ol className="list-decimal list-inside space-y-1 text-blue-700">
            <li>Abra o Google Authenticator no celular</li>
            <li>Toque em + e escolha "Ler QR Code"</li>
            <li>Escaneie o código abaixo</li>
            <li>Digite o código de 6 dígitos gerado</li>
          </ol>
        </div>

        <div className="flex justify-center">
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(totpURI)}`}
            alt="QR Code 2FA"
            className="w-48 h-48 rounded-lg border border-gray-200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Código de verificação
          </label>
          <input
            type="text"
            placeholder="000000"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            maxLength={6}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-center text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          onClick={handleVerify}
          disabled={loading || code.length !== 6}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 text-sm font-medium transition disabled:opacity-50"
        >
          {loading ? "Verificando..." : "Confirmar e ativar 2FA"}
        </button>
      </div>
    );
  }
}