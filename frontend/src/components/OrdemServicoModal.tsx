import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import InputMask from "react-input-mask";
import api from "../lib/axios";
import { Produto, EquipamentoUsado } from "../types";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";

interface OrdemServicoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: OrdemServicoFormData) => Promise<void>;
  ordemServico?: {
    id: number;
    nomeCliente: string;
    documentoCliente: string;
    telefoneCliente: string;
    enderecoCliente: string;
    descricaoProblema: string;
    equipamento: string;
    status: string;
    solucao?: string;
    valorTotal: number;
  };
}

interface OrdemServicoFormData {
  nomeCliente: string;
  documentoCliente: string;
  telefoneCliente: string;
  enderecoCliente: string;
  descricaoProblema: string;
  equipamento: string;
  responsavelId: number;
  status?: string;
  solucao?: string;
  valorTotal: number;
}

export default function OrdemServicoModal({
  isOpen,
  onClose,
  onSave,
  ordemServico,
}: OrdemServicoModalProps) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [formData, setFormData] = useState<OrdemServicoFormData>({
    nomeCliente: "",
    documentoCliente: "",
    telefoneCliente: "",
    enderecoCliente: "",
    descricaoProblema: "",
    equipamento: "",
    responsavelId: 0,
    valorTotal: 0,
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        responsavelId: user.id,
      }));
    }
  }, [user]);

  useEffect(() => {
    if (ordemServico) {
      setFormData({
        nomeCliente: ordemServico.nomeCliente || "",
        documentoCliente: ordemServico.documentoCliente || "",
        telefoneCliente: ordemServico.telefoneCliente || "",
        enderecoCliente: ordemServico.enderecoCliente || "",
        descricaoProblema: ordemServico.descricaoProblema || "",
        equipamento: ordemServico.equipamento || "",
        responsavelId: user?.id || 0,
        status: ordemServico.status || "ABERTA",
        solucao: ordemServico.solucao || "",
        valorTotal: ordemServico.valorTotal || 0,
      });
    } else {
      // Reset do formulário
      setFormData({
        nomeCliente: "",
        documentoCliente: "",
        telefoneCliente: "",
        enderecoCliente: "",
        descricaoProblema: "",
        equipamento: "",
        responsavelId: user?.id || 0,
        valorTotal: 0,
      });
    }
  }, [ordemServico, user]);

  // Função para validar se é CPF ou CNPJ
  const isCPF = (value: string) => {
    const numeros = value.replace(/\D/g, "");
    return numeros.length === 11;
  };

  // Função para validar números
  const handleNumberInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Permite apenas números, backspace, delete, tab, arrows
    if (
      !/[\d\b]/.test(e.key) &&
      !["Backspace", "Delete", "Tab", "ArrowLeft", "ArrowRight"].includes(e.key)
    ) {
      e.preventDefault();
    }
  };

  // Função para limpar caracteres não numéricos
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    setFormData((prev) => ({
      ...prev,
      telefoneCliente: value,
    }));
  };

  // Função para formatar o valor em reais
  const formatarValor = (valor: number) => {
    if (!valor) return "";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);
  };

  // Função para tratar entrada de valor monetário
  const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");

    // Remove zeros à esquerda
    value = value.replace(/^0+/, "");

    // Se ficou vazio, define como 0
    if (!value) {
      setFormData((prev) => ({ ...prev, valorTotal: 0 }));
      return;
    }

    // Converte para número com 2 casas decimais
    const valorNumerico = parseFloat(value) / 100;
    setFormData((prev) => ({
      ...prev,
      valorTotal: valorNumerico,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const documentoNumeros = formData.documentoCliente.replace(/\D/g, "");
    if (documentoNumeros.length !== 11 && documentoNumeros.length !== 14) {
      showToast("O documento deve ser um CPF ou CNPJ válido", "error");
      return;
    }

    if (formData.telefoneCliente.length < 10) {
      showToast("O telefone deve ter no mínimo 10 dígitos", "error");
      return;
    }

    if (formData.valorTotal <= 0) {
      showToast("O valor do serviço deve ser maior que zero", "error");
      return;
    }

    await onSave(formData);
    if (!ordemServico) {
      setFormData({
        nomeCliente: "",
        documentoCliente: "",
        telefoneCliente: "",
        enderecoCliente: "",
        descricaoProblema: "",
        equipamento: "",
        responsavelId: user?.id || 0,
        valorTotal: 0,
      });
    }
    onClose();
  };

  const handlePrint = async (id: number) => {
    try {
      const response = await api.get(`/ordens-servico/${id}/print`);
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      window.open(url);
    } catch (error) {
      showToast("Erro ao imprimir a ordem de serviço", "error");
    }
  };

  return (
    <>
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl">
                  <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block z-10">
                    <button
                      type="button"
                      className="rounded-md bg-white text-gray-400 hover:text-gray-500 transition-colors duration-200"
                      onClick={onClose}
                    >
                      <span className="sr-only">Fechar</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>

                  <div className="bg-gradient-to-r from-primary/90 to-primary px-4 py-6 sm:px-6">
                    <h3 className="text-2xl font-semibold leading-6 text-black">
                      {ordemServico
                        ? "Editar Ordem de Serviço"
                        : "Nova Ordem de Serviço"}
                    </h3>
                    <p className="mt-2 text-sm text-black">
                      {ordemServico
                        ? "Atualize as informações da ordem de serviço"
                        : "Preencha as informações para criar uma nova ordem de serviço"}
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="p-6">
                    <div className="space-y-8">
                      {/* Informações do Cliente */}
                      <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-5 flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-2 text-primary"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Informações do Cliente
                        </h4>
                        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                          <div>
                            <label
                              htmlFor="nomeCliente"
                              className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              Nome do Cliente
                            </label>
                            <input
                              type="text"
                              id="nomeCliente"
                              value={formData.nomeCliente}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  nomeCliente: e.target.value,
                                }))
                              }
                              className="block w-full rounded-md border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary/60 sm:text-sm sm:leading-6 transition-shadow duration-200"
                            />
                          </div>

                          <div>
                            <label
                              htmlFor="documentoCliente"
                              className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              CPF/CNPJ
                            </label>
                            <InputMask
                              mask={
                                isCPF(formData.documentoCliente)
                                  ? "999.999.999-99"
                                  : "99.999.999/9999-99"
                              }
                              value={formData.documentoCliente}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  documentoCliente: e.target.value,
                                }))
                              }
                              className="block w-full rounded-md border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary/60 sm:text-sm sm:leading-6 transition-shadow duration-200"
                            >
                              {(inputProps: any) => (
                                <input
                                  {...inputProps}
                                  type="text"
                                  id="documentoCliente"
                                  placeholder="000.000.000-00"
                                />
                              )}
                            </InputMask>
                          </div>

                          <div>
                            <label
                              htmlFor="telefoneCliente"
                              className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              Telefone
                            </label>
                            <InputMask
                              mask="(99) 99999-9999"
                              value={formData.telefoneCliente}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  telefoneCliente: e.target.value,
                                }))
                              }
                              className="block w-full rounded-md border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary/60 sm:text-sm sm:leading-6 transition-shadow duration-200"
                            >
                              {(inputProps: any) => (
                                <input
                                  {...inputProps}
                                  type="text"
                                  id="telefoneCliente"
                                  placeholder="(00) 00000-0000"
                                />
                              )}
                            </InputMask>
                          </div>

                          <div>
                            <label
                              htmlFor="enderecoCliente"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Endereço
                            </label>
                            <input
                              type="text"
                              id="enderecoCliente"
                              value={formData.enderecoCliente}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  enderecoCliente: e.target.value,
                                }))
                              }
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      {/* Informações do Equipamento */}
                      <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-5 flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-2 text-primary"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0h8v12H6V4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Informações do Equipamento
                        </h4>
                        <div className="grid grid-cols-1 gap-y-6">
                          <div>
                            <label
                              htmlFor="equipamento"
                              className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              Descrição dos Produtos/Equipamentos
                            </label>
                            <textarea
                              id="equipamento"
                              rows={4}
                              value={formData.equipamento}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  equipamento: e.target.value,
                                }))
                              }
                              placeholder="Descreva aqui os produtos ou equipamentos utilizados nesta ordem de serviço..."
                              className="block w-full rounded-md border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary/60 sm:text-sm sm:leading-6 transition-shadow duration-200"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Descrição do Problema */}
                      <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6">
                        <label
                          htmlFor="descricaoProblema"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Descrição do Problema
                        </label>
                        <textarea
                          id="descricaoProblema"
                          rows={4}
                          value={formData.descricaoProblema}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              descricaoProblema: e.target.value,
                            }))
                          }
                          className="block w-full rounded-md border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary/60 sm:text-sm sm:leading-6"
                        />
                      </div>

                      {/* Status e Solução (apenas para edição) */}
                      {ordemServico && (
                        <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6">
                          <h4 className="text-lg font-semibold text-gray-900 mb-5 flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 mr-2 text-primary"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Status e Solução
                          </h4>
                          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                            <div>
                              <label
                                htmlFor="status"
                                className="block text-sm font-medium text-gray-700 mb-1"
                              >
                                Status
                              </label>
                              <select
                                id="status"
                                value={formData.status}
                                onChange={(e) =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    status: e.target.value,
                                  }))
                                }
                                className="block w-full rounded-md border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary/60 sm:text-sm sm:leading-6"
                              >
                                <option value="ABERTA">Aberta</option>
                                <option value="EM_ANDAMENTO">
                                  Em Andamento
                                </option>
                                <option value="AGUARDANDO_PECA">
                                  Aguardando Peça
                                </option>
                                <option value="AGUARDANDO_APROVACAO">
                                  Aguardando Aprovação
                                </option>
                                <option value="CONCLUIDA">Concluída</option>
                                <option value="CANCELADA">Cancelada</option>
                              </select>
                            </div>

                            <div>
                              <label
                                htmlFor="solucao"
                                className="block text-sm font-medium text-gray-700 mb-1"
                              >
                                Solução
                              </label>
                              <textarea
                                id="solucao"
                                rows={4}
                                value={formData.solucao}
                                onChange={(e) =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    solucao: e.target.value,
                                  }))
                                }
                                className="block w-full rounded-md border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary/60 sm:text-sm sm:leading-6"
                                placeholder="Descreva a solução aplicada..."
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Valor do Serviço */}
                      <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-5 flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-2 text-primary"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Valor do Serviço
                        </h4>
                        <div>
                          <label
                            htmlFor="valorTotal"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Valor Total
                          </label>
                          <InputMask
                            mask="R$ 999.999.999,99"
                            value={
                              formData.valorTotal
                                ? formatarValor(formData.valorTotal)
                                : ""
                            }
                            onChange={handleValorChange}
                            className="block w-full rounded-md border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary/60 sm:text-sm sm:leading-6 transition-shadow duration-200"
                            placeholder="R$ 0,00"
                          >
                            {(inputProps: any) => (
                              <input
                                {...inputProps}
                                type="text"
                                id="valorTotal"
                              />
                            )}
                          </InputMask>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={onClose}
                        className="rounded-md bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition-colors duration-200"
                      >
                        Cancelar
                      </button>
                      {ordemServico?.status === "CONCLUIDA" && (
                        <button
                          type="button"
                          onClick={() => handlePrint(ordemServico.id)}
                          className="rounded-md bg-green-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-500 transition-colors duration-200 flex items-center"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-2"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Imprimir OS
                        </button>
                      )}
                      <button
                        type="submit"
                        className="rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 transition-colors duration-200"
                      >
                        {ordemServico ? "Atualizar" : "Criar"}
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}
