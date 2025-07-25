import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";

export default function Perfil() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: user?.nome || "",
    email: user?.email || "",
    senhaAtual: "",
    novaSenha: "",
    confirmarSenha: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // TODO: Implementar a atualização do perfil
      showToast({
        type: "success",
        title: "Perfil atualizado",
        message: "Suas informações foram atualizadas com sucesso!",
      });
    } catch (error) {
      showToast({
        type: "error",
        title: "Erro ao atualizar",
        message: "Não foi possível atualizar suas informações.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-full bg-gray-50">
      <div className="py-6">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Meu Perfil</h1>
          <div className="mt-6">
            <form
              onSubmit={handleSubmit}
              className="space-y-6 bg-white p-6 rounded-lg shadow"
            >
              <div>
                <h2 className="text-lg font-medium text-gray-900">
                  Informações Pessoais
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Atualize suas informações pessoais e senha de acesso.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label
                    htmlFor="nome"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Nome
                  </label>
                  <input
                    type="text"
                    name="nome"
                    id="nome"
                    value={formData.nome}
                    onChange={(e) =>
                      setFormData({ ...formData, nome: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    E-mail
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  />
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">
                    Alterar Senha
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Deixe os campos em branco caso não queira alterar sua senha.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="senhaAtual"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Senha Atual
                  </label>
                  <input
                    type="password"
                    name="senhaAtual"
                    id="senhaAtual"
                    value={formData.senhaAtual}
                    onChange={(e) =>
                      setFormData({ ...formData, senhaAtual: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  />
                </div>

                <div>
                  <label
                    htmlFor="novaSenha"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Nova Senha
                  </label>
                  <input
                    type="password"
                    name="novaSenha"
                    id="novaSenha"
                    value={formData.novaSenha}
                    onChange={(e) =>
                      setFormData({ ...formData, novaSenha: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  />
                </div>

                <div>
                  <label
                    htmlFor="confirmarSenha"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Confirmar Nova Senha
                  </label>
                  <input
                    type="password"
                    name="confirmarSenha"
                    id="confirmarSenha"
                    value={formData.confirmarSenha}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmarSenha: e.target.value,
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex justify-center rounded-md border border-transparent bg-primary py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Salvando..." : "Salvar Alterações"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
