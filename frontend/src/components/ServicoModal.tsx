import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "../contexts/ToastContext";
import api from "../lib/axios";

interface ServicoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  servico?: {
    id: number;
    nome: string;
    descricao: string;
    valor: number;
    tempoEstimado: number;
  };
}

interface ServicoFormData {
  nome: string;
  descricao: string;
  valor: number;
  tempoEstimado: number;
}

export default function ServicoModal({
  isOpen,
  onClose,
  onSuccess,
  servico,
}: ServicoModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ServicoFormData>();
  const { showToast } = useToast();

  useEffect(() => {
    if (servico) {
      reset({
        nome: servico.nome,
        descricao: servico.descricao,
        valor: servico.valor,
        tempoEstimado: servico.tempoEstimado,
      });
    } else {
      reset({
        nome: "",
        descricao: "",
        valor: 0,
        tempoEstimado: 0,
      });
    }
  }, [servico, reset]);

  const onSubmit = async (data: ServicoFormData) => {
    try {
      if (servico) {
        await api.put(`/api/servicos/${servico.id}`, data);
        showToast("Serviço atualizado com sucesso!", "success");
      } else {
        await api.post("/api/servicos", data);
        showToast("Serviço criado com sucesso!", "success");
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Erro ao salvar serviço:", error);
      showToast("Erro ao salvar serviço", "error");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {servico ? "Editar Serviço" : "Novo Serviço"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <span className="sr-only">Fechar</span>
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
              {...register("nome", { required: "Nome é obrigatório" })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            {errors.nome && (
              <p className="mt-1 text-sm text-red-600">{errors.nome.message}</p>
            )}
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
              rows={3}
              {...register("descricao", {
                required: "Descrição é obrigatória",
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            {errors.descricao && (
              <p className="mt-1 text-sm text-red-600">
                {errors.descricao.message}
              </p>
            )}
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
                step="0.01"
                id="valor"
                {...register("valor", {
                  required: "Valor é obrigatório",
                  min: { value: 0, message: "Valor deve ser maior que zero" },
                })}
                className="block w-full rounded-md border-gray-300 pl-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            {errors.valor && (
              <p className="mt-1 text-sm text-red-600">
                {errors.valor.message}
              </p>
            )}
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
              {...register("tempoEstimado", {
                required: "Tempo estimado é obrigatório",
                min: {
                  value: 1,
                  message: "Tempo estimado deve ser maior que zero",
                },
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            {errors.tempoEstimado && (
              <p className="mt-1 text-sm text-red-600">
                {errors.tempoEstimado.message}
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              {servico ? "Atualizar" : "Criar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
