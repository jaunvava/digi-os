import { useEffect, useState } from "react";
import {
  PencilIcon,
  TrashIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { Produto } from "../types";
import api from "../lib/axios";
import ProdutoModal from "../components/ProdutoModal";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";

export default function Produtos() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduto, setSelectedProduto] = useState<Produto | undefined>();
  const { user } = useAuth();
  const isAdmin = user?.tipo === "ADMIN" || user?.tipo === "ROLE_ADMIN";
  const { showToast } = useToast();

  useEffect(() => {
    fetchProdutos();
  }, []);

  async function fetchProdutos() {
    try {
      const response = await api.get("/api/produtos");
      setProdutos(response.data);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      alert("Erro ao carregar produtos. Por favor, recarregue a página.");
    }
  }

  const handleSave = async (produto: Omit<Produto, "id">) => {
    try {
      const response = await api.post<Produto>("/api/produtos", {
        nome: produto.nome,
        descricao: produto.descricao,
        preco: produto.preco,
        quantidadeEstoque: produto.quantidade,
        unidadeMedida: produto.unidadeMedida,
        categoria: produto.categoria,
      });
      setProdutos([...produtos, response.data]);
      showToast("Produto salvo com sucesso!", "success");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
      showToast("Erro ao salvar produto. Por favor, tente novamente.", "error");
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir este produto?")) {
      try {
        await api.delete(`/api/produtos/${id}`);
        await fetchProdutos();
      } catch (error) {
        console.error("Erro ao excluir produto:", error);
        alert("Erro ao excluir produto. Por favor, tente novamente.");
      }
    }
  };

  const handleEdit = (produto: Produto) => {
    setSelectedProduto(produto);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedProduto(undefined);
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">
            {isAdmin ? "Gerenciar Produtos" : "Consultar Produtos"}
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Lista de todos os produtos disponíveis no sistema.
          </p>
        </div>
        {isAdmin && (
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="block rounded-md bg-secondary px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-secondary/90"
            >
              Adicionar Produto
            </button>
          </div>
        )}
      </div>

      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                    >
                      Nome
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Descrição
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Preço
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Quantidade
                    </th>
                    {isAdmin && (
                      <th
                        scope="col"
                        className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                      >
                        <span className="sr-only">Ações</span>
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {produtos.map((produto) => (
                    <tr key={produto.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {produto.nome}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {produto.descricao}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {produto.preco.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <div className="flex items-center gap-1">
                          <span
                            className={
                              produto.quantidade < 10
                                ? "text-red-600"
                                : "text-gray-500"
                            }
                          >
                            {produto.quantidade}
                          </span>
                          {produto.quantidade < 10 && (
                            <ExclamationTriangleIcon
                              className="h-5 w-5 text-red-600"
                              title="Estoque baixo"
                            />
                          )}
                        </div>
                      </td>
                      {isAdmin && (
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <button
                            onClick={() => handleEdit(produto)}
                            className="text-secondary hover:text-secondary/80 mr-4"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(produto.id)}
                            className="text-danger hover:text-danger/80"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {isAdmin && (
        <ProdutoModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSave}
          produto={selectedProduto}
        />
      )}
    </div>
  );
}
