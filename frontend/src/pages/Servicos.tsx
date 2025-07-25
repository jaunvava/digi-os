import { useState, useEffect } from "react";
import { useToast } from "../contexts/ToastContext";
import api from "../lib/axios";
import { PencilSimple, Trash, Plus, X, Check } from "@phosphor-icons/react";

interface Servico {
  id: number;
  nome: string;
  descricao: string;
  valor: number;
  tempoEstimado: number;
}

interface ServicoCreateDTO {
  nome: string;
  descricao: string;
  valor: number;
  tempoEstimado: number;
}

export default function Servicos() {
  const { showToast } = useToast();
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingServico, setEditingServico] = useState<Servico | null>(null);
  const [formData, setFormData] = useState<ServicoCreateDTO>({
    nome: "",
    descricao: "",
    valor: 0,
    tempoEstimado: 0,
  });

  useEffect(() => {
    fetchServicos();
  }, []);

  const fetchServicos = async () => {
    try {
      const response = await api.get<Servico[]>("/api/servicos");
      setServicos(response.data);
    } catch (error) {
      console.error("Erro ao buscar serviços:", error);
      showToast("Erro ao carregar serviços", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    let formattedValue: string | number = value;

    // Formatação do valor monetário
    if (name === "valor") {
      formattedValue = Number(value);
    }

    // Formatação do tempo estimado
    if (name === "tempoEstimado") {
      formattedValue = Number(value);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));
  };

  const validateForm = () => {
    if (!formData.nome || !formData.descricao) {
      showToast("Preencha todos os campos obrigatórios", "error");
      return false;
    }

    if (formData.valor <= 0) {
      showToast("O valor deve ser maior que zero", "error");
      return false;
    }

    if (formData.tempoEstimado <= 0) {
      showToast("O tempo estimado deve ser maior que zero", "error");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (editingServico) {
        await api.put(`/api/servicos/${editingServico.id}`, formData);
        showToast("Serviço atualizado com sucesso!", "success");
      } else {
        await api.post("/api/servicos", formData);
        showToast("Serviço cadastrado com sucesso!", "success");
      }

      setModalOpen(false);
      setEditingServico(null);
      setFormData({
        nome: "",
        descricao: "",
        valor: 0,
        tempoEstimado: 0,
      });
      fetchServicos();
    } catch (error) {
      console.error("Erro ao salvar serviço:", error);
      showToast("Erro ao salvar serviço", "error");
    }
  };

  const handleEdit = (servico: Servico) => {
    setEditingServico(servico);
    setFormData({
      nome: servico.nome,
      descricao: servico.descricao,
      valor: servico.valor,
      tempoEstimado: servico.tempoEstimado,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Tem certeza que deseja excluir este serviço?")) return;

    try {
      await api.delete(`/api/servicos/${id}`);
      showToast("Serviço excluído com sucesso!", "success");
      fetchServicos();
    } catch (error) {
      console.error("Erro ao excluir serviço:", error);
      showToast("Erro ao excluir serviço", "error");
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
        <h1 className="text-2xl font-semibold text-gray-900">Serviços</h1>
        <button
          onClick={() => {
            setEditingServico(null);
            setFormData({
              nome: "",
              descricao: "",
              valor: 0,
              tempoEstimado: 0,
            });
            setModalOpen(true);
          }}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Novo Serviço
        </button>
      </div>

      {/* Tabela de Serviços */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nome
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Descrição
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Valor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tempo Estimado
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {servicos.map((servico) => (
              <tr key={servico.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {servico.nome}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {servico.descricao}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(servico.valor)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {servico.tempoEstimado} minutos
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEdit(servico)}
                    className="text-primary hover:text-primary/80 transition-colors mr-2"
                  >
                    <PencilSimple className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(servico.id)}
                    className="text-red-600 hover:text-red-800 transition-colors"
                  >
                    <Trash className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de Serviço */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {editingServico ? "Editar Serviço" : "Novo Serviço"}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="nome"
                  className="block text-sm font-medium text-gray-700"
                >
                  Nome
                </label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="descricao"
                  className="block text-sm font-medium text-gray-700"
                >
                  Descrição
                </label>
                <textarea
                  id="descricao"
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleInputChange}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="valor"
                  className="block text-sm font-medium text-gray-700"
                >
                  Valor
                </label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-gray-500 sm:text-sm">R$</span>
                  </div>
                  <input
                    type="number"
                    id="valor"
                    name="valor"
                    value={formData.valor}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    className="block w-full rounded-md border-gray-300 pl-10 focus:border-primary focus:ring-primary sm:text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="tempoEstimado"
                  className="block text-sm font-medium text-gray-700"
                >
                  Tempo Estimado (minutos)
                </label>
                <input
                  type="number"
                  id="tempoEstimado"
                  name="tempoEstimado"
                  value={formData.tempoEstimado}
                  onChange={handleInputChange}
                  min="1"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  required
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  <Check className="h-4 w-4 mr-2" />
                  {editingServico ? "Atualizar" : "Cadastrar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
