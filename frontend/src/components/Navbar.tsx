import { Fragment, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { UserCircle, MagnifyingGlass } from "@phosphor-icons/react";
import {
  Cog6ToothIcon,
  UserIcon,
  UserPlusIcon,
  ArrowRightOnRectangleIcon,
  WrenchScrewdriverIcon,
  KeyIcon,
} from "@heroicons/react/24/outline";
import { MenuItem, MenuItemDivider, MenuItemLink, MenuItemButton } from "../types";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

type MenuItemWithFalse = MenuItem | false;

export default function Navbar() {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implementar a lógica de busca
    console.log("Buscando por:", searchQuery);
  };

  const menuItems: MenuItemWithFalse[] = [
    {
      label: "Meu Perfil",
      description: "Alterar senha e dados pessoais",
      icon: UserIcon,
      href: "/perfil",
    } as MenuItemLink,
    {
      type: "divider",
    } as MenuItemDivider,
    user?.tipo === "ADMIN" && {
      label: "Configurações do Sistema",
      description: "Configurações gerais e parâmetros",
      icon: WrenchScrewdriverIcon,
      href: "/configuracoes/sistema",
    } as MenuItemLink,
    user?.tipo === "ADMIN" && {
      label: "Criar Usuário",
      description: "Adicionar novo usuário ao sistema",
      icon: UserPlusIcon,
      href: "/usuarios/novo",
    } as MenuItemLink,
    user?.tipo === "ADMIN" && {
      type: "divider",
    } as MenuItemDivider,
    {
      label: "Alterar Senha",
      description: "Atualizar sua senha de acesso",
      icon: KeyIcon,
      href: "/alterar-senha",
    } as MenuItemLink,
    {
      type: "divider",
    } as MenuItemDivider,
    {
      label: "Sair",
      description: "Encerrar sessão no sistema",
      icon: ArrowRightOnRectangleIcon,
      onClick: logout,
      danger: true,
    } as MenuItemButton,
  ];

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Título móvel (visível apenas em telas pequenas) */}
        <div className="flex items-center md:hidden">
          <span className="text-lg font-semibold text-gray-900">
            Sistema OS
          </span>
        </div>

        {/* Campo de busca */}
        <div className="flex-initial max-w-md hidden sm:block">
          <form onSubmit={handleSearch} className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MagnifyingGlass className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full rounded-lg border-0 py-2 pl-10 pr-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-primary sm:text-sm sm:leading-6"
              placeholder="Buscar..."
            />
          </form>
        </div>

        {/* Menu do usuário */}
        <div className="flex items-center gap-3">
          <span className="hidden sm:block text-sm text-gray-700">
            Bem-vindo(a), {user?.nome}
          </span>
          <Menu as="div" className="relative">
            <Menu.Button className="flex items-center max-w-xs rounded-full hover:ring-2 hover:ring-primary hover:ring-offset-2 transition-all duration-200">
              <span className="sr-only">Abrir menu do usuário</span>
              <div className="relative">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary border-2 border-primary">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.nome}
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <UserCircle weight="fill" className="h-8 w-8" />
                  )}
                </div>
                <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-400 border-2 border-white" />
              </div>
            </Menu.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 z-10 mt-2 w-72 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                {/* Cabeçalho do perfil */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary border-2 border-primary">
                        {user?.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.nome}
                            className="h-full w-full rounded-full object-cover"
                          />
                        ) : (
                          <UserCircle weight="fill" className="h-8 w-8" />
                        )}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {user?.nome}
                        </p>
                        <span
                          className={classNames(
                            "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                            user?.tipo === "ADMIN"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-blue-100 text-blue-800"
                          )}
                        >
                          {user?.tipo === "ADMIN" ? "Admin" : "Operador"}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 truncate">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="py-1">
                  {menuItems.map((item, index) => 
                    item && (
                      <Menu.Item key={index}>
                        {({ active }) => (
                          <div
                            className={classNames(
                              active ? "bg-gray-50" : "",
                              "w-full"
                            )}
                          >
                            {"type" in item && item.type === "divider" ? (
                              <div className="h-px bg-gray-100 my-1" />
                            ) : (
                              <div>
                                {item.onClick ? (
                                  <button
                                    onClick={item.onClick}
                                    className={classNames(
                                      item.danger ? "text-red-700" : "text-gray-700",
                                      "group flex items-center px-4 py-2.5 text-sm w-full"
                                    )}
                                  >
                                    <div className="flex items-center gap-3 flex-1">
                                      <item.icon className="h-5 w-5" />
                                      <div>
                                        <p className="font-medium">{item.label}</p>
                                        {item.description && (
                                          <p className="text-xs text-gray-500">
                                            {item.description}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  </button>
                                ) : (
                                  <Link
                                    to={item.href}
                                    className={classNames(
                                      item.danger ? "text-red-700" : "text-gray-700",
                                      "group flex items-center px-4 py-2.5 text-sm w-full"
                                    )}
                                  >
                                    <div className="flex items-center gap-3 flex-1">
                                      <item.icon className="h-5 w-5" />
                                      <div>
                                        <p className="font-medium">{item.label}</p>
                                        {item.description && (
                                          <p className="text-xs text-gray-500">
                                            {item.description}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  </Link>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </Menu.Item>
                    )
                  )}
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>

      {/* Campo de busca móvel */}
      <div className="sm:hidden px-4 pb-3">
        <form onSubmit={handleSearch} className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MagnifyingGlass className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full rounded-lg border-0 py-2 pl-10 pr-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-primary sm:text-sm sm:leading-6"
            placeholder="Buscar..."
          />
        </form>
      </div>
    </nav>
  );
}
