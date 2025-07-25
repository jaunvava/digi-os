import {
  UserGroupIcon,
  CubeIcon,
  WrenchScrewdriverIcon,
  ClipboardDocumentListIcon,
  DocumentTextIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";

interface SystemStatsData {
  clientes: number;
  produtos: number;
  servicos: number;
  ordens: number;
  garantias: number;
  vendas: number;
}

export default function SystemStats() {
  const [stats, setStats] = useState<SystemStatsData>({
    clientes: 1,
    produtos: 1,
    servicos: 0,
    ordens: 0,
    garantias: 0,
    vendas: 0,
  });

  useEffect(() => {
    // Aqui você pode adicionar a chamada real à API quando estiver pronta
    // const fetchStats = async () => {
    //   const response = await api.get('/api/stats');
    //   setStats(response.data);
    // };
    // fetchStats();
  }, []);

  const statCards = [
    {
      title: "Clientes",
      value: stats.clientes,
      icon: UserGroupIcon,
      color: "text-blue-500",
      iconBg: "bg-blue-100",
    },
    {
      title: "Produtos",
      value: stats.produtos,
      icon: CubeIcon,
      color: "text-orange-500",
      iconBg: "bg-orange-100",
    },
    {
      title: "Serviços",
      value: stats.servicos,
      icon: WrenchScrewdriverIcon,
      color: "text-teal-500",
      iconBg: "bg-teal-100",
    },
    {
      title: "Ordens",
      value: stats.ordens,
      icon: ClipboardDocumentListIcon,
      color: "text-pink-500",
      iconBg: "bg-pink-100",
    },
    {
      title: "Garantias",
      value: stats.garantias,
      icon: DocumentTextIcon,
      color: "text-purple-500",
      iconBg: "bg-purple-100",
    },
    {
      title: "Vendas",
      value: stats.vendas,
      icon: ShoppingCartIcon,
      color: "text-emerald-500",
      iconBg: "bg-emerald-100",
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Estatísticas do Sistema
      </h2>
      <div className="grid grid-cols-1 gap-3">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg border border-gray-200 p-3 flex items-center justify-between"
          >
            <div className="flex items-center">
              <div className={`${stat.iconBg} p-2 rounded-lg mr-3`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <span className="text-gray-600">{stat.title}</span>
            </div>
            <span className="text-xl font-bold">{stat.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
