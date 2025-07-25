import { useState } from "react";
import { useToast } from "../contexts/ToastContext";

export default function ConfiguracoesSistema() {
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    nomeEmpresa: "Sistema OS",
    cnpj: "00.000.000/0000-00",
    telefone: "(00) 0000-0000",
    email: "contato@sistema-os.com",
    endereco: "Rua Exemplo, 123",
    cidade: "Cidade",
    estado: "UF",
    logotipo: null as File | null,
    previewLogotipo: "/logo.png",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // TODO: Implementar a atualização das configurações
      showToast({
        type: "success",
        title: "Configurações atualizadas",
        message: "As configurações do sistema foram atualizadas com sucesso!",
      });
    } catch (error) {
      showToast({
        type: "error",
        title: "Erro ao atualizar",
        message: "Não foi possível atualizar as configurações do sistema.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({
        ...formData,
        logotipo: file,
        previewLogotipo: URL.createObjectURL(file),
      });
    }
  };

  return (
    <div className="min-h-full bg-gray-50">
      <div className="py-6">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">
            Configurações do Sistema
          </h1>
          <div className="mt-6">
            <form
              onSubmit={handleSubmit}
              className="space-y-6 bg-white p-6 rounded-lg shadow"
            >
              <div>
                <h2 className="text-lg font-medium text-gray-900">
                  Informações da Empresa
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Configure as informações que aparecerão nos relatórios e
                  documentos.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {/* Logotipo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Logotipo
                  </label>
                  <div className="mt-1 flex items-center gap-4">
                    <img
                      src={formData.previewLogotipo}
                      alt="Logotipo"
                      className="h-20 w-auto object-contain bg-gray-50 rounded-lg"
                    />
                    <div>
                      <label
                        htmlFor="logotipo"
                        className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                      >
                        Alterar Logotipo
                      </label>
                      <input
                        type="file"
                        id="logotipo"
                        accept="image/*"
                        onChange={handleLogoChange}
                        className="sr-only"
                      />
                      <p className="mt-2 text-xs text-gray-500">
                        PNG ou JPG até 2MB
                      </p>
                    </div>
                  </div>
                </div>

                {/* Nome da Empresa */}
                <div>
                  <label
                    htmlFor="nomeEmpresa"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Nome da Empresa
                  </label>
                  <input
                    type="text"
                    name="nomeEmpresa"
                    id="nomeEmpresa"
                    value={formData.nomeEmpresa}
                    onChange={(e) =>
                      setFormData({ ...formData, nomeEmpresa: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  />
                </div>

                {/* CNPJ */}
                <div>
                  <label
                    htmlFor="cnpj"
                    className="block text-sm font-medium text-gray-700"
                  >
                    CNPJ
                  </label>
                  <input
                    type="text"
                    name="cnpj"
                    id="cnpj"
                    value={formData.cnpj}
                    onChange={(e) =>
                      setFormData({ ...formData, cnpj: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  />
                </div>

                {/* Telefone */}
                <div>
                  <label
                    htmlFor="telefone"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Telefone
                  </label>
                  <input
                    type="text"
                    name="telefone"
                    id="telefone"
                    value={formData.telefone}
                    onChange={(e) =>
                      setFormData({ ...formData, telefone: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  />
                </div>

                {/* E-mail */}
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

                {/* Endereço */}
                <div>
                  <label
                    htmlFor="endereco"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Endereço
                  </label>
                  <input
                    type="text"
                    name="endereco"
                    id="endereco"
                    value={formData.endereco}
                    onChange={(e) =>
                      setFormData({ ...formData, endereco: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  />
                </div>

                {/* Cidade e Estado */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="cidade"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Cidade
                    </label>
                    <input
                      type="text"
                      name="cidade"
                      id="cidade"
                      value={formData.cidade}
                      onChange={(e) =>
                        setFormData({ ...formData, cidade: e.target.value })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="estado"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Estado
                    </label>
                    <input
                      type="text"
                      name="estado"
                      id="estado"
                      value={formData.estado}
                      onChange={(e) =>
                        setFormData({ ...formData, estado: e.target.value })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex justify-center rounded-md border border-transparent bg-primary py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Salvando..." : "Salvar Configurações"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
