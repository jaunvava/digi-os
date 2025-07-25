import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon, PrinterIcon } from "@heroicons/react/24/outline";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { OrdemServico } from "../types";

interface OrdemServicoVisualizarModalProps {
  isOpen: boolean;
  onClose: () => void;
  ordem: OrdemServico;
  onPrint: () => void;
}

export default function OrdemServicoVisualizarModal({
  isOpen,
  onClose,
  ordem,
  onPrint,
}: OrdemServicoVisualizarModalProps) {
  if (!ordem) {
    return null;
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

  const statusLabels = {
    ABERTA: "Aberta",
    EM_ANDAMENTO: "Em Andamento",
    AGUARDANDO_PECA: "Aguardando Peça",
    AGUARDANDO_APROVACAO: "Aguardando Aprovação",
    CONCLUIDA: "Concluída",
    CANCELADA: "Cancelada",
  };

  return (
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6">
                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500"
                    onClick={onClose}
                  >
                    <span className="sr-only">Fechar</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium leading-6 text-gray-900">
                        Ordem de Serviço #{ordem.numero}
                      </h3>
                      <button
                        type="button"
                        onClick={onPrint}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                      >
                        <PrinterIcon className="h-5 w-5 mr-2" />
                        Imprimir
                      </button>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">
                          Data de Abertura
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                          {formatarData(ordem.dataAbertura)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">
                          Data de Fechamento
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                          {formatarData(ordem.dataFechamento)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Status</p>
                        <p className="text-sm font-medium text-gray-900">
                          {statusLabels[ordem.status]}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Valor Total</p>
                        <p className="text-sm font-medium text-gray-900">
                          {formatarValor(ordem.valorTotal)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-2">
                      Informações do Cliente
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Nome</p>
                        <p className="text-sm font-medium text-gray-900">
                          {ordem.nomeCliente}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Documento</p>
                        <p className="text-sm font-medium text-gray-900">
                          {ordem.documentoCliente}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Telefone</p>
                        <p className="text-sm font-medium text-gray-900">
                          {ordem.telefoneCliente}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Endereço</p>
                        <p className="text-sm font-medium text-gray-900">
                          {ordem.enderecoCliente}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-2">
                      Informações do Equipamento
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Equipamento</p>
                        <p className="text-sm font-medium text-gray-900">
                          {ordem.equipamento}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Marca</p>
                        <p className="text-sm font-medium text-gray-900">
                          {ordem.marca}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Modelo</p>
                        <p className="text-sm font-medium text-gray-900">
                          {ordem.modelo}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Número de Série</p>
                        <p className="text-sm font-medium text-gray-900">
                          {ordem.numeroSerie}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-2">
                      Problema e Solução
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-500">
                          Descrição do Problema
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                          {ordem.descricaoProblema}
                        </p>
                      </div>
                      {ordem.solucao && (
                        <div>
                          <p className="text-sm text-gray-500">Solução</p>
                          <p className="text-sm font-medium text-gray-900">
                            {ordem.solucao}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-2">
                      Equipamentos Usados
                    </h4>
                    {ordem.equipamentosUsados &&
                    ordem.equipamentosUsados.length > 0 ? (
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Produto
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Quantidade
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Preço Unit.
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Total
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {ordem.equipamentosUsados.map((equip, index) => (
                            <tr key={index}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {equip.nome}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                                {equip.quantidade}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                                R$ {equip.precoUnitario.toFixed(2)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                                R$ {equip.precoTotal.toFixed(2)}
                              </td>
                            </tr>
                          ))}
                          <tr className="bg-gray-50">
                            <td
                              colSpan={3}
                              className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right"
                            >
                              Total Geral:
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                              R${" "}
                              {ordem.equipamentosUsados
                                .reduce(
                                  (sum, equip) => sum + equip.precoTotal,
                                  0
                                )
                                .toFixed(2)}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    ) : (
                      <p className="text-sm text-gray-500">
                        Nenhum equipamento usado
                      </p>
                    )}
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
