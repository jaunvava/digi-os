import { useEffect, useState } from "react";
import api from "../lib/axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";
import { Bar, Pie, Line } from "react-chartjs-2";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

interface Produto {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  quantidadeEstoque: number;
  unidadeMedida: string;
  categoria: string;
  dataCadastro: string;
  dataAtualizacao: string;
}

interface EstoqueStats {
  totalProdutos: number;
  valorTotalEstoque: number;
  produtosBaixoEstoque: number;
  mediaPreco: number;
  distribuicaoPorCategoria: Record<string, number>;
  produtosMaisVendidos: Array<{ nome: string; quantidade: number }>;
}

export default function AnaliseEstoque() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [stats, setStats] = useState<EstoqueStats>({
    totalProdutos: 0,
    valorTotalEstoque: 0,
    produtosBaixoEstoque: 0,
    mediaPreco: 0,
    distribuicaoPorCategoria: {},
    produtosMaisVendidos: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const response = await api.get<Produto[]>("/api/produtos");
      const produtos = response.data;
      setProdutos(produtos);

      // Calcular estatísticas
      const stats: EstoqueStats = {
        totalProdutos: produtos.length,
        valorTotalEstoque: produtos.reduce(
          (total, produto) => total + produto.preco * produto.quantidadeEstoque,
          0
        ),
        produtosBaixoEstoque: produtos.filter(
          (produto) => produto.quantidadeEstoque < 10
        ).length,
        mediaPreco:
          produtos.reduce((total, produto) => total + produto.preco, 0) /
          produtos.length,
        distribuicaoPorCategoria: produtos.reduce((acc, produto) => {
          acc[produto.categoria] = (acc[produto.categoria] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        produtosMaisVendidos: [], // Será preenchido com dados reais da API
      };

      setStats(stats);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  }

  // Dados para o gráfico de distribuição por categoria
  const categoriasData = {
    labels: Object.keys(stats.distribuicaoPorCategoria),
    datasets: [
      {
        data: Object.values(stats.distribuicaoPorCategoria),
        backgroundColor: [
          "rgba(255, 99, 132, 0.8)",
          "rgba(54, 162, 235, 0.8)",
          "rgba(255, 206, 86, 0.8)",
          "rgba(75, 192, 192, 0.8)",
          "rgba(153, 102, 255, 0.8)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Dados para o gráfico de níveis de estoque
  const estoqueData = {
    labels: produtos.map((produto) => produto.nome),
    datasets: [
      {
        label: "Quantidade em Estoque",
        data: produtos.map((produto) => produto.quantidadeEstoque),
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Dados para o gráfico de valor em estoque por produto
  const valorEstoqueData = {
    labels: produtos.map((produto) => produto.nome),
    datasets: [
      {
        label: "Valor em Estoque (R$)",
        data: produtos.map(
          (produto) => produto.preco * produto.quantidadeEstoque
        ),
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Análise de Estoque
      </h1>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-500">
            Total de Produtos
          </h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {stats.totalProdutos}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-500">
            Valor Total em Estoque
          </h3>
          <p className="mt-2 text-3xl font-bold text-green-600">
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(stats.valorTotalEstoque)}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-500">
            Produtos com Baixo Estoque
          </h3>
          <p className="mt-2 text-3xl font-bold text-red-600">
            {stats.produtosBaixoEstoque}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-500">Preço Médio</h3>
          <p className="mt-2 text-3xl font-bold text-blue-600">
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(stats.mediaPreco)}
          </p>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Distribuição por Categoria */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Distribuição por Categoria
          </h2>
          <div className="h-[300px]">
            <Pie data={categoriasData} options={pieOptions} />
          </div>
        </div>

        {/* Níveis de Estoque */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Níveis de Estoque
          </h2>
          <div className="h-[300px]">
            <Bar data={estoqueData} options={chartOptions} />
          </div>
        </div>

        {/* Valor em Estoque por Produto */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Valor em Estoque por Produto
          </h2>
          <div className="h-[300px]">
            <Bar data={valorEstoqueData} options={chartOptions} />
          </div>
        </div>

        {/* Lista de Produtos com Baixo Estoque */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Produtos com Baixo Estoque
          </h2>
          <div className="overflow-y-auto max-h-[300px]">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Produto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantidade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {produtos
                  .filter((produto) => produto.quantidadeEstoque < 10)
                  .map((produto) => (
                    <tr key={produto.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {produto.nome}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {produto.quantidadeEstoque} {produto.unidadeMedida}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            produto.quantidadeEstoque === 0
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {produto.quantidadeEstoque === 0
                            ? "Sem Estoque"
                            : "Baixo Estoque"}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
