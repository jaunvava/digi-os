import { useState, useEffect } from "react";
import { useToast } from "../contexts/ToastContext";
import api from "../lib/axios";
import { Cliente, ClienteCreateDTO } from "../types";
import { PencilSimple, Trash, Plus, X, Check } from "@phosphor-icons/react";

export default function Clientes() {
  const { showToast } = useToast();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);
  const [formData, setFormData] = useState<ClienteCreateDTO>({
    documento: "",
    nome: "",
    contato: "",
    endereco: "",
  });

  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    try {
      setLoading(true);
      const response = await api.get<Cliente[]>("/api/clientes");
      setClientes(response.data);
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
      showToast("Erro ao carregar clientes", "error");
      setClientes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Formatação do documento (CPF/CNPJ)
    if (name === "documento") {
      formattedValue = value.replace(/\D/g, "");
      if (formattedValue.length <= 11) {
        // CPF
        formattedValue = formattedValue
          .replace(/(\d{3})(\d)/, "$1.$2")
          .replace(/(\d{3})(\d)/, "$1.$2")
          .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
      } else {
        // CNPJ
        formattedValue = formattedValue
          .replace(/^(\d{2})(\d)/, "$1.$2")
          .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
          .replace(/\.(\d{3})(\d)/, ".$1/$2")
          .replace(/(\d{4})(\d)/, "$1-$2");
      }
    }

    // Formatação do contato (telefone)
    if (name === "contato") {
      formattedValue = value.replace(/\D/g, "");
      if (formattedValue.length <= 11) {
        formattedValue = formattedValue
          .replace(/(\d{2})(\d)/, "($1) $2")
          .replace(/(\d{4,5})(\d{4})$/, "$1-$2");
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));
  };

  const validateForm = () => {
    if (
      !formData.documento ||
      !formData.nome ||
      !formData.contato ||
      !formData.endereco
    ) {
      showToast("Preencha todos os campos obrigatórios", "error");
      return false;
    }

    const documento = formData.documento.replace(/\D/g, "");
    if (documento.length !== 11 && documento.length !== 14) {
      showToast("Documento inválido", "error");
      return false;
    }

    const contato = formData.contato.replace(/\D/g, "");
    if (contato.length < 10) {
      showToast("Contato inválido", "error");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (editingCliente) {
        await api.put(`/api/clientes/${editingCliente.id}`, formData);
        showToast("Cliente atualizado com sucesso!", "success");
      } else {
        await api.post("/api/clientes", formData);
        showToast("Cliente cadastrado com sucesso!", "success");
      }

      setModalOpen(false);
      setEditingCliente(null);
      setFormData({
        documento: "",
        nome: "",
        contato: "",
        endereco: "",
      });
      fetchClientes();
    } catch (error) {
      console.error("Erro ao salvar cliente:", error);
      showToast("Erro ao salvar cliente", "error");
    }
  };

  const handleEdit = (cliente: Cliente) => {
    setEditingCliente(cliente);
    setFormData({
      documento: cliente.documento,
      nome: cliente.nome,
      contato: cliente.contato,
      endereco: cliente.endereco,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Tem certeza que deseja excluir este cliente?")) return;

    try {
      await api.delete(`/api/clientes/${id}`);
      showToast("Cliente excluído com sucesso!", "success");
      fetchClientes();
    } catch (error) {
      console.error("Erro ao excluir cliente:", error);
      showToast("Erro ao excluir cliente", "error");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Clientes</h1>
        <button
          onClick={() => {
            setEditingCliente(null);
            setFormData({
              documento: "",
              nome: "",
              contato: "",
              endereco: "",
            });
            setModalOpen(true);
          }}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Novo Cliente
        </button>
      </div>

      {/* Tabela de Clientes */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {clientes.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">👥</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum cliente encontrado
            </h3>
            <p className="text-gray-500 mb-4">
              Comece cadastrando seu primeiro cliente.
            </p>
            <button
              onClick={() => {
                setEditingCliente(null);
                setFormData({
                  documento: "",
                  nome: "",
                  contato: "",
                  endereco: "",
                });
                setModalOpen(true);
              }}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 mx-auto"
            >
              <Plus className="h-5 w-5" />
              Cadastrar Primeiro Cliente
            </button>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Documento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contato
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Endereço
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {clientes.map((cliente) => (
                <tr key={cliente.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {cliente.documento}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {cliente.nome}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {cliente.contato}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {cliente.endereco}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(cliente)}
                      className="text-primary hover:text-primary/80 mr-3"
                    >
                      <PencilSimple className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(cliente.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal de Cadastro/Edição */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingCliente ? "Editar Cliente" : "Novo Cliente"}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label
                  htmlFor="documento"
                  className="block text-sm font-medium text-gray-700"
                >
                  CPF/CNPJ
                </label>
                <input
                  type="text"
                  id="documento"
                  name="documento"
                  value={formData.documento}
                  onChange={handleInputChange}
                  maxLength={18}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  placeholder="000.000.000-00"
                />
              </div>
              <div>
                <label
                  htmlFor="nome"
                  className="block text-sm font-medium text-gray-700"
                >
                  Nome/Razão Social
                </label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  placeholder="Nome completo ou razão social"
                />
              </div>
              <div>
                <label
                  htmlFor="contato"
                  className="block text-sm font-medium text-gray-700"
                >
                  Contato
                </label>
                <input
                  type="text"
                  id="contato"
                  name="contato"
                  value={formData.contato}
                  onChange={handleInputChange}
                  maxLength={15}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  placeholder="(00) 00000-0000"
                />
              </div>
              <div>
                <label
                  htmlFor="endereco"
                  className="block text-sm font-medium text-gray-700"
                >
                  Endereço
                </label>
                <input
                  type="text"
                  id="endereco"
                  name="endereco"
                  value={formData.endereco}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  placeholder="Endereço completo"
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary flex items-center gap-2"
                >
                  <Check className="h-4 w-4" />
                  {editingCliente ? "Atualizar" : "Cadastrar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
