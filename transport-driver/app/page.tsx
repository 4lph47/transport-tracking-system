"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    bi: "",
    senha: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simular autenticação
    setTimeout(() => {
      if (formData.bi === "110203456789A" && formData.senha === "123456") {
        // Login bem-sucedido
        localStorage.setItem("motorista", JSON.stringify({
          id: "1",
          nome: "João Manuel Silva",
          bi: "110203456789A",
          transporte: {
            id: "1",
            matricula: "AAA-1234-MP",
            modelo: "Hiace",
            marca: "Toyota",
          },
          via: {
            id: "1",
            nome: "Zimpeto - Baixa",
            codigo: "VIA-001",
          },
        }));
        router.push("/dashboard");
      } else {
        setError("BI ou senha incorretos");
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-4xl">🚐</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">TransportMZ Driver</h1>
          <p className="text-blue-100">Portal do Motorista</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Iniciar Sessão
          </h2>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800 text-center">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bilhete de Identidade
              </label>
              <input
                type="text"
                required
                value={formData.bi}
                onChange={(e) => setFormData({ ...formData, bi: e.target.value })}
                placeholder="Ex: 110203456789A"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <input
                type="password"
                required
                value={formData.senha}
                onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                placeholder="Digite sua senha"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center">
              Esqueceu a senha?{" "}
              <a href="#" className="text-blue-600 hover:underline font-medium">
                Recuperar
              </a>
            </p>
          </div>
        </div>

        {/* Demo Credentials */}
        <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-lg p-4">
          <p className="text-xs text-white text-center mb-2 font-semibold">
            🔐 Credenciais de Demonstração:
          </p>
          <div className="text-xs text-blue-100 text-center space-y-1">
            <p>BI: <span className="font-mono bg-white/20 px-2 py-1 rounded">110203456789A</span></p>
            <p>Senha: <span className="font-mono bg-white/20 px-2 py-1 rounded">123456</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}
