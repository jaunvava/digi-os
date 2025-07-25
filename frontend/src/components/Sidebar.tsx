import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  HomeIcon,
  ClipboardDocumentListIcon,
  CubeIcon,
  ChartPieIcon,
  UsersIcon,
  DocumentChartBarIcon,
  BuildingStorefrontIcon,
  DocumentTextIcon,
  ChartBarIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";
import { NavLink } from "react-router-dom";
import {
  House,
  ClipboardText,
  Package,
  ChartLine,
  Users,
  UserCircle,
  ChartPie,
  Gear,
} from "@phosphor-icons/react";

// Navegação principal
const mainNavigation = [
  { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
];

// Navegação de Ordens de Serviço
const ordensNavigation = [
  {
    name: "Ordens de Serviço",
    href: "/ordens-servico",
    icon: ClipboardDocumentListIcon,
  },
];

// Navegação de Produtos e Estoque
const produtosNavigation = [
  { name: "Produtos", href: "/produtos", icon: CubeIcon },
  {
    name: "Análise de Estoque",
    href: "/analise-estoque",
    icon: ChartBarIcon,
  },
];

// Navegação de Relatórios (apenas admin)
const relatoriosNavigation = [
  {
    name: "Relatório de Vendas",
    href: "/relatorios/vendas",
    icon: DocumentChartBarIcon,
  },
  {
    name: "Relatório de OS",
    href: "/relatorios/os",
    icon: DocumentTextIcon,
  },
];

// Navegação de Clientes
const clientesNavigation = [
  { name: "Clientes", href: "/clientes", icon: UsersIcon },
];

// Navegação de Serviços
const servicosNavigation = [
  { name: "Serviços", href: "/servicos", icon: WrenchScrewdriverIcon },
];

const navigation = [
  { name: "Dashboard", href: "/", icon: House },
  { name: "Ordens de Serviço", href: "/ordens-servico", icon: ClipboardText },
  { name: "Produtos", href: "/produtos", icon: Package },
  { name: "Análise de Estoque", href: "/analise-estoque", icon: ChartLine },
  { name: "Clientes", href: "/clientes", icon: Users },
];

export default function Sidebar() {
  const location = useLocation();
  const { user } = useAuth();
  const isAdmin = user?.tipo === "ADMIN";

  const renderNavigationSection = (items: any[], title: string) => {
    if (items.length === 0) return null;

    return (
      <div className="space-y-1">
        <h3 className="px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          {title}
        </h3>
        {items.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={classNames(
                isActive
                  ? "bg-white/10 text-white"
                  : "text-gray-300 hover:bg-white/5 hover:text-white",
                "group flex items-center gap-x-3 rounded-md px-6 py-2.5 text-sm font-medium"
              )}
            >
              <item.icon
                className={classNames(
                  isActive
                    ? "text-white"
                    : "text-gray-400 group-hover:text-white",
                  "h-5 w-5 shrink-0"
                )}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex h-full flex-col bg-[#313A46] w-72">
      {/* Logo */}
      <div className="flex h-24 shrink-0 items-center justify-center border-b border-gray-700/50 px-6">
        <img
          src="/logo.png"
          alt="Sistema OS"
          className="h-20 w-auto object-contain"
        />
      </div>

      {/* Menu de navegação */}
      <div className="flex flex-1 flex-col overflow-y-auto py-4 space-y-6 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
        {renderNavigationSection(mainNavigation, "Principal")}
        {renderNavigationSection(ordensNavigation, "Ordens de Serviço")}
        {renderNavigationSection(produtosNavigation, "Produtos e Estoque")}
        {renderNavigationSection(clientesNavigation, "Clientes")}
        {renderNavigationSection(servicosNavigation, "Serviços")}
        {isAdmin && renderNavigationSection(relatoriosNavigation, "Relatórios")}
      </div>
    </div>
  );
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
