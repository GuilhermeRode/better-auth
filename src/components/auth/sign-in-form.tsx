"use client";

import { useState } from "react";
import { signIn } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

/**
 * Formulário de login — Client Component.
 * Suporta: email/senha, GitHub OAuth e Passkey.
 */
export function SignInForm() {
  const router = useRouter();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState<string | null>(null);
  const [loading, setLoading]   = useState(false);

  // F1 — Login com email e senha
  async function handleEmailSignIn(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await signIn.email({ email, password });

    if (error) {
      setError(error.message ?? "Erro ao fazer login.");
    } else {
      router.push("/dashboard");
    }
    setLoading(false);
  }

  // F2 — Login com GitHub
  async function handleGitHub() {
    await signIn.social({ provider: "github", callbackURL: "/dashboard" });
  }

  // F4 — Login com Passkey
  async function handlePasskey() {
    const { error } = await signIn.passkey();
    if (error) {
      setError(error.message ?? "Passkey não reconhecida.");
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <div className="w-full max-w-sm space-y-4">
      <h1 className="text-2xl font-bold text-center">Entrar</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleEmailSignIn} className="space-y-3">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border rounded px-3 py-2 text-sm"
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full border rounded px-3 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white rounded py-2 text-sm font-medium disabled:opacity-50"
        >
          {loading ? "Entrando..." : "Entrar com email"}
        </button>
      </form>

      <div className="relative text-center text-sm text-gray-400">
        <span className="bg-white px-2 relative z-10">ou continue com</span>
        <hr className="absolute top-1/2 w-full border-gray-200" />
      </div>

      <button
        onClick={handleGitHub}
        className="w-full border rounded py-2 text-sm font-medium flex items-center justify-center gap-2"
      >
        {/* GitHub icon SVG omitido para brevidade */}
        Entrar com GitHub
      </button>

      <button
        onClick={handlePasskey}
        className="w-full border rounded py-2 text-sm font-medium"
      >
        🔑 Entrar com Passkey
      </button>

      <p className="text-center text-sm text-gray-500">
        Não tem conta?{" "}
        <a href="/auth/sign-up" className="text-blue-600 underline">
          Criar conta
        </a>
      </p>
    </div>
  );
}
