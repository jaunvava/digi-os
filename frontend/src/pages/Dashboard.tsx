import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../lib/axios";
import {
  Users,
  Wrench,
  Package,
  ClipboardText,
  Plus,
} from "@phosphor-icons/react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  ChartOptions,
} from "chart.js";
import { Line, Pie } from "react-chartjs-2";
import AgendaOrdens from "../components/AgendaOrdens";
import SystemStats from "../components/SystemStats";
import QuickActions from "../components/QuickActions";
import SalesChart from "../components/SalesChart";
import OrderStatusChart from "../components/OrderStatusChart";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

type OrdemServico = {
  id: number;
  status: "ABERTA" | "EM_ANDAMENTO" | "CONCLUIDA" | "CANCELADA";
  valorTotal: number;
  dataAbertura: string;
};

type DashboardStats = {
  totalOrdensAbertas: number;
  totalOrdensEmAndamento: number;
  totalOrdensConcluidas: number;
  totalOrdensCanceladas: number;
  faturamentoTotal: number;
  ticketMedio: number;
  produtosBaixoEstoque: number;
};

type PageResponse<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
};

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalOrdensAbertas: 0,
    totalOrdensEmAndamento: 0,
    totalOrdensConcluidas: 0,
    totalOrdensCanceladas: 0,
    faturamentoTotal: 0,
    ticketMedio: 0,
    produtosBaixoEstoque: 0,
  });
  const [ordensServico, setOrdensServico] = useState<OrdemServico[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsResponse, ordensResponse] = await Promise.all([
          api.get<DashboardStats>("/api/dashboard/stats"),
          api.get<PageResponse<OrdemServico>>("/api/ordens-servico"),
        ]);

        setStats(statsResponse.data);
        setOrdensServico(ordensResponse.data.content || []);
        setError(null);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
        setError(
          "Erro ao carregar dados. Por favor, tente novamente mais tarde."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Dados para o gráfico de linha (média de vendas por mês)
  const vendasPorMes = ordensServico.reduce((acc, ordem) => {
    const data = new Date(ordem.dataAbertura);
    const mes = data.toLocaleString("pt-BR", { month: "long" });

    if (!acc[mes]) {
      acc[mes] = {
        total: ordem.valorTotal,
        quantidade: 1,
      };
    } else {
      acc[mes].total += ordem.valorTotal;
      acc[mes].quantidade += 1;
    }

    return acc;
  }, {} as Record<string, { total: number; quantidade: number }>);

  const mediaVendasData = {
    labels: Object.keys(vendasPorMes),
    datasets: [
      {
        label: "Média de Vendas (R$)",
        data: Object.values(vendasPorMes).map(
          (mes) => mes.total / mes.quantidade
        ),
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        tension: 0.3,
      },
    ],
  };

  // Dados para o gráfico de pizza (status das ordens)
  const statusCount = ordensServico.reduce((acc, ordem) => {
    acc[ordem.status] = (acc[ordem.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusData = {
    labels: ["Abertas", "Em Andamento", "Concluídas", "Canceladas"],
    datasets: [
      {
        data: [
          statusCount["ABERTA"] || 0,
          statusCount["EM_ANDAMENTO"] || 0,
          statusCount["CONCLUIDA"] || 0,
          statusCount["CANCELADA"] || 0,
        ],
        backgroundColor: [
          "rgba(255, 206, 86, 0.8)", // Amarelo
          "rgba(54, 162, 235, 0.8)", // Azul
          "rgba(75, 192, 192, 0.8)", // Verde
          "rgba(255, 99, 132, 0.8)", // Vermelho
        ],
        borderColor: [
          "rgba(255, 206, 86, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(255, 99, 132, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const lineOptions: ChartOptions<"line"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Média de Vendas por Mês",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (tickValue) {
            if (typeof tickValue === "number") {
              return `R$ ${tickValue.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`;
            }
            return tickValue;
          },
        },
      },
    },
  };

  const pieOptions: ChartOptions<"pie"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Status das Ordens de Serviço",
      },
    },
  };

  const quickActions = [
    {
      title: "Nova OS",
      description: "Criar ordem de serviço",
      icon: ClipboardText,
      color: "bg-blue-500 hover:bg-blue-600",
      onClick: () => navigate("/ordens-servico"),
    },
    {
      title: "Novo Produto",
      description: "Cadastrar produto",
      icon: Package,
      color: "bg-green-500 hover:bg-green-600",
      onClick: () => navigate("/produtos"),
    },
    {
      title: "Novo Serviço",
      description: "Cadastrar serviço",
      icon: Wrench,
      color: "bg-purple-500 hover:bg-purple-600",
      onClick: () => navigate("/servicos"),
    },
    {
      title: "Novo Cliente",
      description: "Cadastrar cliente",
      icon: Users,
      color: "bg-orange-500 hover:bg-orange-600",
      onClick: () => navigate("/clientes"),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <QuickActions />

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <AgendaOrdens />
        </div>
        <div className="col-span-1">
          <SystemStats />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <SalesChart />
        <OrderStatusChart />
      </div>
    </div>
  );
}
