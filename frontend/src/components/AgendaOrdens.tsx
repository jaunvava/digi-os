import { useState, useEffect } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  parseISO,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import api from "../lib/axios";

interface OrdemServico {
  id: number;
  dataPrevisaoEntrega: string;
  cliente: {
    nome: string;
  };
  status: string;
}

export default function AgendaOrdens() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [ordensServico, setOrdensServico] = useState<OrdemServico[]>([]);

  useEffect(() => {
    fetchOrdensServico();
  }, [currentDate]);

  const fetchOrdensServico = async () => {
    try {
      // Dados mockados enquanto o endpoint não está pronto
      const mockData = [
        {
          id: 1,
          dataPrevisaoEntrega: "2025-06-15T10:00:00",
          cliente: { nome: "João Silva" },
          status: "Em Andamento",
        },
        {
          id: 2,
          dataPrevisaoEntrega: "2025-06-20T14:00:00",
          cliente: { nome: "Maria Santos" },
          status: "Em Aberto",
        },
        {
          id: 3,
          dataPrevisaoEntrega: "2025-06-25T16:00:00",
          cliente: { nome: "Pedro Oliveira" },
          status: "Em Andamento",
        },
      ];
      setOrdensServico(mockData);
    } catch (error) {
      console.error("Erro ao buscar ordens de serviço:", error);
    }
  };

  const diasDoMes = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  });

  const diasAntesDoPrimeiroMes = [];
  const primeiroDiaDaSemana = diasDoMes[0].getDay();
  for (let i = primeiroDiaDaSemana - 1; i >= 0; i--) {
    diasAntesDoPrimeiroMes.push(
      new Date(diasDoMes[0].getTime() - i * 24 * 60 * 60 * 1000)
    );
  }

  const diasDepoisDoUltimoMes = [];
  const ultimoDiaDaSemana = diasDoMes[diasDoMes.length - 1].getDay();
  for (let i = 1; i <= 6 - ultimoDiaDaSemana; i++) {
    diasDepoisDoUltimoMes.push(
      new Date(
        diasDoMes[diasDoMes.length - 1].getTime() + i * 24 * 60 * 60 * 1000
      )
    );
  }

  const todosOsDias = [
    ...diasAntesDoPrimeiroMes,
    ...diasDoMes,
    ...diasDepoisDoUltimoMes,
  ];

  const getOrdensServicoDoDia = (dia: Date) => {
    return ordensServico.filter((ordem) => {
      const dataEntrega = parseISO(ordem.dataPrevisaoEntrega);
      return (
        dataEntrega.getDate() === dia.getDate() &&
        dataEntrega.getMonth() === dia.getMonth() &&
        dataEntrega.getFullYear() === dia.getFullYear()
      );
    });
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };

  const previousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 h-[32rem]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Agenda de Entregas
        </h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={previousMonth}
            className="p-2 text-gray-600 hover:text-gray-900"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          <h2 className="text-lg font-semibold text-gray-900">
            {format(currentDate, "MMMM yyyy", { locale: ptBR })}
          </h2>
          <button
            onClick={nextMonth}
            className="p-2 text-gray-600 hover:text-gray-900"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
          <button
            onClick={goToToday}
            className="ml-4 px-3 py-1 text-sm text-indigo-600 hover:text-indigo-900 border border-indigo-600 rounded-md"
          >
            Hoje
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px bg-gray-200 border border-gray-200 rounded-lg overflow-hidden h-[calc(100%-4rem)]">
        {["dom", "seg", "ter", "qua", "qui", "sex", "sáb"].map((dia) => (
          <div
            key={dia}
            className="bg-gray-50 py-2 text-center text-xs font-semibold uppercase text-gray-700"
          >
            {dia}
          </div>
        ))}

        {todosOsDias.map((dia, index) => {
          const ordensServicoDoDia = getOrdensServicoDoDia(dia);
          const isCurrentMonth = isSameMonth(dia, currentDate);
          const isCurrentDay = isToday(dia);

          return (
            <div
              key={index}
              className={`bg-white p-2 relative flex flex-col ${
                !isCurrentMonth ? "bg-gray-50" : ""
              }`}
            >
              <span
                className={`inline-flex items-center justify-center text-sm ${
                  !isCurrentMonth ? "text-gray-400" : "text-gray-900"
                } ${
                  isCurrentDay
                    ? "h-6 w-6 rounded-full bg-indigo-600 text-white"
                    : ""
                }`}
              >
                {format(dia, "d")}
              </span>
              <div className="mt-1 flex-1 overflow-y-auto">
                {ordensServicoDoDia.map((ordem) => (
                  <div
                    key={ordem.id}
                    className="px-2 py-1 text-xs rounded bg-indigo-100 text-indigo-700 truncate mb-1"
                    title={`${ordem.cliente.nome} - ${ordem.status}`}
                  >
                    {ordem.cliente.nome}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
