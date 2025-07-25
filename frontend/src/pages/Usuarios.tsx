import { useEffect, useState } from "react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import api from "../lib/axios";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import { Navigate } from "react-router-dom";
import UsuarioModal from "../components/UsuarioModal";

interface Usuario {
  id: number;
  nome: string;
  email: string;
  tipo: "ADMIN" | "OPERADOR";
}

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState<Usuario | undefined>();
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    if (user?.tipo === "ADMIN") {
      fetchUsuarios();
    }
  }, [user]);

  async function fetchUsuarios() {
    try {
      console.log("Iniciando busca de usuários...");
      console.log("Token atual:", localStorage.getItem("@SistemaOS:token"));

      setLoading(true);
      const response = await api.get("/api/usuarios");

      console.log("Resposta da API:", response.data);
      setUsuarios(response.data);
      setLoading(false);
    } catch (error: any) {
      console.error("Erro detalhado ao buscar usuários:", {
        error,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers,
      });

      showToast(
        error.response?.data?.message || "Erro ao carregar usuários.",
        "error"
      );
      setLoading(false);
    }
  }

  // Redireciona se não for admin
  if (user?.tipo !== "ADMIN") {
    return <Navigate to="/dashboard" />;
  }

  const handleSave = async (data: any) => {
    try {
      if (selectedUsuario) {
        await api.put(`/api/usuarios/${selectedUsuario.id}`, data);
        showToast("Usuário atualizado com sucesso!", "success");
      } else {
        await api.post("/api/usuarios", data);
        showToast("Usuário criado com sucesso!", "success");
      }
      fetchUsuarios();
      setIsModalOpen(false);
    } catch (error: any) {
      console.error("Erro ao salvar usuário:", error);
      showToast(
        error.response?.data?.message ||
          "Erro ao salvar usuário. Verifique os dados e tente novamente.",
        "error"
      );
    }
  };

  const handleDelete = async (id: number) => {
    if (id === user?.id) {
      showToast("Você não pode excluir seu próprio usuário!", "error");
      return;
    }

    if (window.confirm("Tem certeza que deseja excluir este usuário?")) {
      try {
        await api.delete(`/api/usuarios/${id}`);
        showToast("Usuário excluído com sucesso!", "success");
        fetchUsuarios();
      } catch (error: any) {
        console.error("Erro ao excluir usuário:", error);
        showToast(
          error.response?.data?.message ||
            "Erro ao excluir usuário. Tente novamente.",
          "error"
        );
      }
    }
  };

  const handleEdit = (usuario: Usuario) => {
    setSelectedUsuario(usuario);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Usuários</h1>
          <p className="mt-2 text-sm text-gray-700">
            Gerencie os usuários do sistema e seus níveis de acesso.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            onClick={() => {
              setSelectedUsuario(undefined);
              setIsModalOpen(true);
            }}
            className="block rounded-md bg-primary px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-primary/90"
          >
            Novo Usuário
          </button>
        </div>
      </div>

      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                    >
                      Nome
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Nível de Acesso
                    </th>
                    <th
                      scope="col"
                      className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                    >
                      <span className="sr-only">Ações</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {usuarios.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="text-center py-4 text-gray-500"
                      >
                        Nenhum usuário encontrado.
                      </td>
                    </tr>
                  ) : (
                    usuarios.map((usuario) => (
                      <tr key={usuario.id} className="hover:bg-gray-50">
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {usuario.nome}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {usuario.email}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              usuario.tipo === "ADMIN"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {usuario.tipo === "ADMIN"
                              ? "Administrador"
                              : "Operador"}
                          </span>
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <button
                            onClick={() => handleEdit(usuario)}
                            className="text-primary hover:text-primary/80 mr-4"
                            disabled={usuario.id === user?.id}
                          >
                            <PencilIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(usuario.id)}
                            className="text-danger hover:text-danger/80"
                            disabled={usuario.id === user?.id}
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <UsuarioModal
        isOpen={isModalOpen}
        onClose={() => {
          setSelectedUsuario(undefined);
          setIsModalOpen(false);
        }}
        onSave={handleSave}
        usuario={selectedUsuario}
      />
    </div>
  );
}
