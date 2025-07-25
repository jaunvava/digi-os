import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ToastProvider } from "./contexts/ToastContext";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import Dashboard from "./pages/Dashboard";
import OrdensServico from "./pages/OrdensServico";
import Produtos from "./pages/Produtos";
import Usuarios from "./pages/Usuarios";
import AnaliseEstoque from "./pages/AnaliseEstoque";
import PrivateRoute from "./components/PrivateRoute";
import DashboardLayout from "./components/DashboardLayout";
import Clientes from "./pages/Clientes";
import Servicos from "./pages/Servicos";
import Perfil from "./pages/Perfil";
import ConfiguracoesSistema from "./pages/ConfiguracoesSistema";
import "./index.css";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Rotas públicas */}
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />

            {/* Rotas protegidas */}
            <Route element={<PrivateRoute />}>
              <Route path="/" element={<DashboardLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="produtos" element={<Produtos />} />
                <Route path="ordens-servico" element={<OrdensServico />} />
                <Route path="analise-estoque" element={<AnaliseEstoque />} />
                <Route path="clientes" element={<Clientes />} />
                <Route path="servicos" element={<Servicos />} />
                <Route path="usuarios" element={<Usuarios />} />
                <Route path="perfil" element={<Perfil />} />
                <Route
                  path="configuracoes/sistema"
                  element={<ConfiguracoesSistema />}
                />
              </Route>
            </Route>

            {/* Redireciona qualquer rota não encontrada para o dashboard */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
