import { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: "#1e40af",
      titleColor: "#fff",
      bodyColor: "#fff",
      padding: 12,
      displayColors: false,
      callbacks: {
        label: function (context: any) {
          return `R$ ${context.parsed.y.toLocaleString("pt-BR")}`;
        },
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: "#f0f0f0",
      },
      ticks: {
        callback: function (value: any) {
          return `R$ ${value.toLocaleString("pt-BR")}`;
        },
      },
    },
    x: {
      grid: {
        display: false,
      },
    },
  },
  elements: {
    line: {
      tension: 0.4,
    },
  },
};

export default function SalesChart() {
  const [currentMonth] = useState("Junho 2024");

  const data = {
    labels: ["01/06", "05/06", "10/06", "15/06", "20/06", "25/06", "30/06"],
    datasets: [
      {
        fill: true,
        data: [4500, 6000, 5500, 7800, 7200, 8500, 9000],
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
      },
    ],
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Vendas do Mês</h2>
        <div className="text-sm font-medium text-gray-500">{currentMonth}</div>
      </div>
      <div className="h-72">
        <Line options={options} data={data} />
      </div>
    </div>
  );
}
