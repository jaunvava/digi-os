import { useEffect, useState } from "react";
import api from "../lib/axios";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import OrdemServicoModal from "../components/OrdemServicoModal";
import OrdemServicoVisualizarModal from "../components/OrdemServicoVisualizarModal";
import { useToast } from "../contexts/ToastContext";
import { PencilIcon, PrinterIcon, EyeIcon } from "@heroicons/react/24/outline";

interface OrdemServico {
  id: number;
  numero: string;
  nomeCliente: string;
  documentoCliente: string;
  telefoneCliente: string;
  enderecoCliente: string;
  dataAbertura: string;
  dataFechamento: string | null;
  valorTotal: number;
  status:
    | "ABERTA"
    | "EM_ANDAMENTO"
    | "AGUARDANDO_PECA"
    | "AGUARDANDO_APROVACAO"
    | "CONCLUIDA"
    | "CANCELADA";
  descricaoProblema: string;
  solucao: string | null;
  equipamento: string;
  marca: string;
  modelo: string;
  numeroSerie: string;
  equipamentosUsados: any[];
}

interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

const statusColors = {
  ABERTA: "bg-yellow-100 text-yellow-800",
  EM_ANDAMENTO: "bg-blue-100 text-blue-800",
  AGUARDANDO_PECA: "bg-orange-100 text-orange-800",
  AGUARDANDO_APROVACAO: "bg-purple-100 text-purple-800",
  CONCLUIDA: "bg-green-100 text-green-800",
  CANCELADA: "bg-red-100 text-red-800",
};

const statusLabels = {
  ABERTA: "Aberta",
  EM_ANDAMENTO: "Em Andamento",
  AGUARDANDO_PECA: "Aguardando Peça",
  AGUARDANDO_APROVACAO: "Aguardando Aprovação",
  CONCLUIDA: "Concluída",
  CANCELADA: "Cancelada",
};

export default function OrdensServico() {
  const { showToast } = useToast();
  const [ordens, setOrdens] = useState<OrdemServico[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVisualizarModalOpen, setIsVisualizarModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [selectedOrdem, setSelectedOrdem] = useState<OrdemServico | null>(null);

  useEffect(() => {
    loadOrdens(currentPage);
  }, [currentPage]);

  async function loadOrdens(page: number) {
    try {
      const response = await api.get<PageResponse<OrdemServico>>(
        `/api/ordens-servico?page=${page}&size=10`
      );
      setOrdens(response.data.content);
      setTotalPages(response.data.totalPages);
      setTotalElements(response.data.totalElements);
    } catch (error) {
      console.error("Erro ao carregar ordens de serviço:", error);
      showToast("Erro ao carregar ordens de serviço", "error");
    } finally {
      setIsLoading(false);
    }
  }

  function formatarData(data: string | null) {
    if (!data) return "-";
    return format(new Date(data), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
  }

  function formatarValor(valor: number) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);
  }

  const handleSaveOrdem = async (data: any) => {
    try {
      if (selectedOrdem) {
        await api.put(`/api/ordens-servico/${selectedOrdem.id}`, data);
        showToast("Ordem de serviço atualizada com sucesso!", "success");

        // Se a OS foi marcada como concluída, redireciona para a edição
        if (data.status === "CONCLUIDA") {
          handleEdit(selectedOrdem);
        }
      } else {
        const response = await api.post("/api/ordens-servico", data);
        showToast("Ordem de serviço criada com sucesso!", "success");
      }

      loadOrdens(currentPage);
      setIsModalOpen(false);
      setSelectedOrdem(null);
    } catch (error) {
      console.error("Erro ao salvar ordem de serviço:", error);
      showToast("Erro ao salvar ordem de serviço", "error");
    }
  };

  const handleEdit = async (ordem: OrdemServico) => {
    try {
      const response = await api.get<OrdemServico>(
        `/api/ordens-servico/${ordem.id}`
      );
      if (response.data) {
        setSelectedOrdem(response.data);
        setIsModalOpen(true);
      } else {
        showToast("Erro ao carregar ordem de serviço", "error");
      }
    } catch (error) {
      console.error("Erro ao carregar ordem de serviço:", error);
      showToast("Erro ao carregar ordem de serviço", "error");
    }
  };

  const handleView = async (ordem: OrdemServico) => {
    try {
      const response = await api.get<OrdemServico>(
        `/api/ordens-servico/${ordem.id}`
      );
      if (response.data) {
        setSelectedOrdem(response.data);
        setIsVisualizarModalOpen(true);
      } else {
        showToast("Erro ao carregar ordem de serviço", "error");
      }
    } catch (error) {
      console.error("Erro ao carregar ordem de serviço:", error);
      showToast("Erro ao carregar ordem de serviço", "error");
    }
  };

  const handlePrint = async (id: number) => {
    try {
      const response = await api.get(`/api/pdf/ordem-servico/${id}`, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (error: any) {
      console.error("Erro ao gerar PDF:", error);
      if (error.response?.status === 500) {
        showToast(
          "Erro interno ao gerar PDF. Por favor, tente novamente.",
          "error"
        );
      } else {
        showToast(
          "Erro ao gerar PDF: " +
            (error.response?.data?.message || "Erro desconhecido"),
          "error"
        );
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">
            Ordens de Serviço
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Lista de todas as ordens de serviço do sistema
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            onClick={() => {
              setSelectedOrdem(null);
              setIsModalOpen(true);
            }}
            className="block rounded-md bg-primary px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-primary/90"
          >
            Nova Ordem
          </button>
        </div>
      </div>

      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                    >
                      Número
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Cliente
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Equipamento
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Data de Abertura
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900"
                    >
                      Valor Total
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900"
                    >
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {ordens.map((ordem) => (
                    <tr key={ordem.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {ordem.numero}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {ordem.nomeCliente}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {ordem.equipamento} - {ordem.marca}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {formatarData(ordem.dataAbertura)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            statusColors[ordem.status]
                          }`}
                        >
                          {statusLabels[ordem.status]}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {formatarValor(ordem.valorTotal)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-right">
                        <button
                          onClick={() => handleView(ordem)}
                          className="text-gray-600 hover:text-gray-900 mr-2"
                          title="Visualizar"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleEdit(ordem)}
                          className="text-primary hover:text-primary-dark mr-2"
                          title="Editar"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        {ordem.status === "CONCLUIDA" && (
                          <button
                            onClick={() => handlePrint(ordem.id)}
                            className="text-gray-600 hover:text-gray-900"
                            title="Imprimir"
                          >
                            <PrinterIcon className="h-5 w-5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Paginação */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex-1 flex justify-between sm:hidden">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
            disabled={currentPage === 0}
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-500"
          >
            Anterior
          </button>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))
            }
            disabled={currentPage === totalPages - 1}
            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-500"
          >
            Próxima
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Mostrando{" "}
              <span className="font-medium">
                {currentPage * 10 + 1}-
                {Math.min((currentPage + 1) * 10, totalElements)}
              </span>{" "}
              de <span className="font-medium">{totalElements}</span> resultados
            </p>
          </div>
          <div>
            <nav
              className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
              aria-label="Pagination"
            >
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
                disabled={currentPage === 0}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100"
              >
                Anterior
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i)}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                    currentPage === i
                      ? "z-10 bg-primary border-primary text-white"
                      : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))
                }
                disabled={currentPage === totalPages - 1}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100"
              >
                Próxima
              </button>
            </nav>
          </div>
        </div>
      </div>

      <OrdemServicoModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedOrdem(null);
        }}
        onSave={handleSaveOrdem}
        ordemServico={selectedOrdem || undefined}
      />

      {selectedOrdem && isVisualizarModalOpen && (
        <OrdemServicoVisualizarModal
          isOpen={isVisualizarModalOpen}
          onClose={() => {
            setIsVisualizarModalOpen(false);
            setSelectedOrdem(null);
          }}
          ordem={selectedOrdem}
          onPrint={() => handlePrint(selectedOrdem.id)}
        />
      )}
    </div>
  );
}
