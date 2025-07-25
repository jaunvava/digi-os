import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "bottom" as const,
      labels: {
        padding: 20,
        usePointStyle: true,
        pointStyle: "circle",
      },
    },
    tooltip: {
      backgroundColor: "#1e40af",
      titleColor: "#fff",
      bodyColor: "#fff",
      padding: 12,
      displayColors: false,
      callbacks: {
        label: function (context: any) {
          return `${context.label}: ${context.parsed}%`;
        },
      },
    },
  },
  cutout: "60%",
};

export default function OrderStatusChart() {
  // Dados mockados - substituir por dados reais da API
  const data = {
    labels: ["Em Aberto", "Em Andamento", "Concluídas", "Canceladas"],
    datasets: [
      {
        data: [30, 45, 20, 5],
        backgroundColor: [
          "rgba(99, 102, 241, 0.8)", // Indigo para Em Aberto
          "rgba(59, 130, 246, 0.8)", // Azul para Em Andamento
          "rgba(34, 197, 94, 0.8)", // Verde para Concluídas
          "rgba(239, 68, 68, 0.8)", // Vermelho para Canceladas
        ],
        borderColor: [
          "rgb(99, 102, 241)",
          "rgb(59, 130, 246)",
          "rgb(34, 197, 94)",
          "rgb(239, 68, 68)",
        ],
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Status das Ordens
        </h2>
      </div>
      <div className="h-64">
        <Doughnut options={options} data={data} />
      </div>
    </div>
  );
}
