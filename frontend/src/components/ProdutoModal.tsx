import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Produto } from "../types";

interface ProdutoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (produto: Omit<Produto, "id">) => void;
  produto?: Produto;
}

export default function ProdutoModal({
  isOpen,
  onClose,
  onSave,
  produto,
}: ProdutoModalProps) {
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    preco: "",
    quantidade: "",
    unidadeMedida: "",
    categoria: "",
  });

  useEffect(() => {
    if (produto) {
      setFormData({
        nome: produto.nome,
        descricao: produto.descricao,
        preco: produto.preco.toString(),
        quantidade: produto.quantidade.toString(),
        unidadeMedida: produto.unidadeMedida,
        categoria: produto.categoria,
      });
    } else {
      setFormData({
        nome: "",
        descricao: "",
        preco: "",
        quantidade: "",
        unidadeMedida: "",
        categoria: "",
      });
    }
  }, [produto]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      nome: formData.nome,
      descricao: formData.descricao,
      preco: parseFloat(formData.preco),
      quantidade: parseInt(formData.quantidade),
      unidadeMedida: formData.unidadeMedida,
      categoria: formData.categoria,
    });
    onClose();
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
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

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="nome"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Nome
                      </label>
                      <input
                        type="text"
                        name="nome"
                        id="nome"
                        value={formData.nome}
                        onChange={(e) =>
                          setFormData({ ...formData, nome: e.target.value })
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-secondary focus:ring-secondary sm:text-sm"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="descricao"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Descrição
                      </label>
                      <textarea
                        name="descricao"
                        id="descricao"
                        value={formData.descricao}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            descricao: e.target.value,
                          })
                        }
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-secondary focus:ring-secondary sm:text-sm"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="preco"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Preço
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        name="preco"
                        id="preco"
                        value={formData.preco}
                        onChange={(e) =>
                          setFormData({ ...formData, preco: e.target.value })
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-secondary focus:ring-secondary sm:text-sm"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="quantidade"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Quantidade
                      </label>
                      <input
                        type="number"
                        name="quantidade"
                        id="quantidade"
                        value={formData.quantidade}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            quantidade: e.target.value,
                          })
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-secondary focus:ring-secondary sm:text-sm"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="unidadeMedida"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Unidade de Medida
                      </label>
                      <select
                        name="unidadeMedida"
                        id="unidadeMedida"
                        value={formData.unidadeMedida}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            unidadeMedida: e.target.value,
                          })
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-secondary focus:ring-secondary sm:text-sm"
                        required
                      >
                        <option value="">Selecione...</option>
                        <option value="UN">Unidade</option>
                        <option value="KG">Quilograma</option>
                        <option value="L">Litro</option>
                        <option value="M">Metro</option>
                        <option value="CX">Caixa</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="categoria"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Categoria
                      </label>
                      <select
                        name="categoria"
                        id="categoria"
                        value={formData.categoria}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            categoria: e.target.value,
                          })
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-secondary focus:ring-secondary sm:text-sm"
                        required
                      >
                        <option value="">Selecione...</option>
                        <option value="MATERIAL">Material</option>
                        <option value="FERRAMENTA">Ferramenta</option>
                        <option value="EQUIPAMENTO">Equipamento</option>
                        <option value="INSUMO">Insumo</option>
                        <option value="OUTRO">Outro</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                    <button
                      type="submit"
                      className="inline-flex w-full justify-center rounded-md bg-secondary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-secondary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary sm:col-start-2"
                    >
                      Salvar
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                      onClick={onClose}
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
