import React, { useState, useEffect } from "react";
import { Produto, EquipamentoUsado } from "../types";
import axios from "../lib/axios";

interface EquipamentosUsadosModalProps {
  isOpen: boolean;
  onClose: () => void;
  equipamentosUsados: EquipamentoUsado[];
  onSave: (equipamentos: EquipamentoUsado[]) => void;
}

export const EquipamentosUsadosModal: React.FC<
  EquipamentosUsadosModalProps
> = ({ isOpen, onClose, equipamentosUsados, onSave }) => {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [equipamentos, setEquipamentos] =
    useState<EquipamentoUsado[]>(equipamentosUsados);
  const [selectedProdutoId, setSelectedProdutoId] = useState<number | "">("");
  const [quantidade, setQuantidade] = useState<number>(1);

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const response = await axios.get("/produtos");
        setProdutos(response.data);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      }
    };

    if (isOpen) {
      fetchProdutos();
      setEquipamentos(equipamentosUsados);
    }
  }, [isOpen, equipamentosUsados]);

  const handleAddEquipamento = () => {
    if (!selectedProdutoId) return;

    const produto = produtos.find((p) => p.id === selectedProdutoId);
    if (!produto) return;

    const novoEquipamento: EquipamentoUsado = {
      produtoId: produto.id,
      nome: produto.nome,
      quantidade,
      precoUnitario: produto.preco,
      precoTotal: produto.preco * quantidade,
    };

    setEquipamentos([...equipamentos, novoEquipamento]);
    setSelectedProdutoId("");
    setQuantidade(1);
  };

  const handleRemoveEquipamento = (index: number) => {
    const novosEquipamentos = equipamentos.filter((_, i) => i !== index);
    setEquipamentos(novosEquipamentos);
  };

  const handleSave = () => {
    onSave(equipamentos);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <h2 className="text-xl font-bold mb-4">Equipamentos Usados</h2>

        <div className="mb-4 flex gap-4">
          <select
            className="flex-1 border rounded p-2"
            value={selectedProdutoId}
            onChange={(e) => setSelectedProdutoId(Number(e.target.value))}
          >
            <option value="">Selecione um produto</option>
            {produtos.map((produto) => (
              <option key={produto.id} value={produto.id}>
                {produto.nome} - R$ {produto.preco.toFixed(2)}
              </option>
            ))}
          </select>

          <input
            type="number"
            min="1"
            value={quantidade}
            onChange={(e) => setQuantidade(Number(e.target.value))}
            className="w-24 border rounded p-2"
            placeholder="Qtd"
          />

          <button
            onClick={handleAddEquipamento}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Adicionar
          </button>
        </div>

        <div className="mb-4">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Produto</th>
                <th className="border p-2 text-right">Quantidade</th>
                <th className="border p-2 text-right">Preço Unit.</th>
                <th className="border p-2 text-right">Total</th>
                <th className="border p-2"></th>
              </tr>
            </thead>
            <tbody>
              {equipamentos.map((equip, index) => (
                <tr key={index}>
                  <td className="border p-2">{equip.nome}</td>
                  <td className="border p-2 text-right">{equip.quantidade}</td>
                  <td className="border p-2 text-right">
                    R$ {equip.precoUnitario.toFixed(2)}
                  </td>
                  <td className="border p-2 text-right">
                    R$ {equip.precoTotal.toFixed(2)}
                  </td>
                  <td className="border p-2 text-center">
                    <button
                      onClick={() => handleRemoveEquipamento(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remover
                    </button>
                  </td>
                </tr>
              ))}
              <tr className="font-bold">
                <td colSpan={3} className="border p-2 text-right">
                  Total Geral:
                </td>
                <td className="border p-2 text-right">
                  R${" "}
                  {equipamentos
                    .reduce((sum, equip) => sum + equip.precoTotal, 0)
                    .toFixed(2)}
                </td>
                <td className="border p-2"></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
};
