import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(email, senha);
    } catch (error: any) {
      console.error("Erro no login:", error);
      setError(
        error.message ||
          "Credenciais inválidas. Por favor, verifique seu email e senha."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Lado Esquerdo - Informações de Contato */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient">
        <div className="w-full flex flex-col justify-center px-12 text-white">
          <h2 className="text-4xl font-bold mb-8">Bem-vindo ao Sistema OS</h2>
          <p className="text-lg mb-12">
            Sistema completo para gerenciamento de ordens de serviço e controle
            de estoque.
          </p>

          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <PhoneIcon className="h-6 w-6" />
              <div>
                <p className="font-semibold">Telefone</p>
                <p>(11) 99999-9999</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <EnvelopeIcon className="h-6 w-6" />
              <div>
                <p className="font-semibold">Email</p>
                <p>contato@sistemaos.com.br</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <MapPinIcon className="h-6 w-6" />
              <div>
                <p className="font-semibold">Endereço</p>
                <p>Rua do Sistema, 123 - São Paulo, SP</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lado Direito - Formulário de Login */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="max-w-md w-full">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Acesse sua conta
            </h2>
            <p className="text-sm text-gray-600">
              Entre com suas credenciais para acessar o sistema
            </p>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm font-semibold text-blue-800 mb-2">
                Credenciais disponíveis:
              </p>
              <div className="space-y-2 text-sm text-blue-700">
                <p>
                  <span className="font-medium">Administrador:</span>{" "}
                  fernando@sistemaos.com / 123456
                </p>
                <p>
                  <span className="font-medium">Operador:</span>{" "}
                  joao.pedro@sistemaos.com / 123456
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder=" "
                  className="block w-full px-3 pt-4 pb-1 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-secondary focus:border-secondary peer"
                  disabled={isLoading}
                />
                <label
                  htmlFor="email"
                  className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-gray-50 px-2 peer-focus:px-2 peer-focus:text-secondary peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
                >
                  Email
                </label>
              </div>

              <div className="relative">
                <input
                  id="senha"
                  name="senha"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder=" "
                  className="block w-full px-3 pt-4 pb-1 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-secondary focus:border-secondary peer"
                  disabled={isLoading}
                />
                <label
                  htmlFor="senha"
                  className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-gray-50 px-2 peer-focus:px-2 peer-focus:text-secondary peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
                >
                  Senha
                </label>
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-secondary hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
