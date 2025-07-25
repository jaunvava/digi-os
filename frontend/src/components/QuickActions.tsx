import { Link } from "react-router-dom";
import {
  UserPlusIcon,
  PlusIcon,
  WrenchScrewdriverIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

export default function QuickActions() {
  const actions = [
    {
      title: "Nova OS",
      subtitle: "Criar ordem de serviço",
      icon: ClipboardDocumentListIcon,
      path: "/ordens-servico/nova",
      bgColor: "bg-blue-500",
      hoverBgColor: "hover:bg-blue-600",
      iconBgColor: "bg-blue-400/30",
    },
    {
      title: "Novo Produto",
      subtitle: "Cadastrar produto",
      icon: PlusIcon,
      path: "/produtos/novo",
      bgColor: "bg-emerald-500",
      hoverBgColor: "hover:bg-emerald-600",
      iconBgColor: "bg-emerald-400/30",
    },
    {
      title: "Novo Serviço",
      subtitle: "Cadastrar serviço",
      icon: WrenchScrewdriverIcon,
      path: "/servicos/novo",
      bgColor: "bg-violet-500",
      hoverBgColor: "hover:bg-violet-600",
      iconBgColor: "bg-violet-400/30",
    },
    {
      title: "Novo Cliente",
      subtitle: "Cadastrar cliente",
      icon: UserPlusIcon,
      path: "/clientes/novo",
      bgColor: "bg-orange-500",
      hoverBgColor: "hover:bg-orange-600",
      iconBgColor: "bg-orange-400/30",
    },
    {
      title: "Análise Estoque",
      subtitle: "Verificar produtos",
      icon: ChartBarIcon,
      path: "/analise-estoque",
      bgColor: "bg-rose-500",
      hoverBgColor: "hover:bg-rose-600",
      iconBgColor: "bg-rose-400/30",
    },
  ];

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4 text-gray-700">
        Ações Rápidas
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 max-w-7xl">
        {actions.map((action, index) => (
          <Link
            key={index}
            to={action.path}
            className={`
              ${action.bgColor} ${action.hoverBgColor}
              rounded-lg
              px-3.5 py-3.5
              transition-all
              duration-200
              transform hover:-translate-y-1
              flex items-center
              text-white
              shadow-md
              hover:shadow-lg
              group
              relative
              overflow-hidden
              min-w-[200px]
            `}
          >
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <div
                  className={`
                  ${action.iconBgColor}
                  rounded-lg
                  p-2.5
                  backdrop-blur-sm
                  group-hover:bg-opacity-40
                  transition-all
                  duration-200
                `}
                >
                  <action.icon className="h-5 w-5 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-base font-semibold leading-snug">
                    {action.title}
                  </span>
                  <p className="text-sm text-white/90 leading-snug mt-0.5">
                    {action.subtitle}
                  </p>
                </div>
              </div>
            </div>
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <PlusIcon className="h-4 w-4 text-white/80 group-hover:text-white transition-colors" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
