export type TipoUsuario = "ADMIN" | "OPERADOR";

export type Usuario = {
  id: number;
  nome: string;
  email: string;
  senha?: string;
  tipo: TipoUsuario;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
};

export type Produto = {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  quantidade: number;
  createdAt: string;
  updatedAt: string;
};

export interface EquipamentoUsado {
  id?: number;
  nome: string;
  quantidade: number;
  precoUnitario: number;
  precoTotal: number;
}

export interface OrdemServico {
  id: number;
  numero: string;
  nomeCliente: string;
  documentoCliente: string;
  telefoneCliente: string;
  enderecoCliente: string;
  dataAbertura: string;
  dataFechamento: string | null;
  valorTotal: number;
  status:
    | "ABERTA"
    | "EM_ANDAMENTO"
    | "AGUARDANDO_PECA"
    | "AGUARDANDO_APROVACAO"
    | "CONCLUIDA"
    | "CANCELADA";
  descricaoProblema: string;
  solucao: string | null;
  equipamento: string;
  marca: string;
  modelo: string;
  numeroSerie: string;
  equipamentosUsados: EquipamentoUsado[];
}

export type ItemServico = {
  id: number;
  produto: Produto;
  quantidade: number;
  valorUnitario: number;
};

export type AuthContextType = {
  user: Usuario | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
};

export type Cliente = {
  id: number;
  documento: string; // CPF ou CNPJ
  nome: string; // Nome ou Razão Social
  contato: string;
  endereco: string;
  createdAt: string;
  updatedAt: string;
};

export type ClienteCreateDTO = {
  documento: string;
  nome: string;
  contato: string;
  endereco: string;
};

export type ClienteUpdateDTO = {
  documento?: string;
  nome?: string;
  contato?: string;
  endereco?: string;
};

export type MenuItemDivider = {
  type: "divider";
};

export type MenuItemLink = {
  label: string;
  description?: string;
  icon: React.ComponentType<any>;
  href: string;
  onClick?: never;
  danger?: boolean;
  type?: never;
};

export type MenuItemButton = {
  label: string;
  description?: string;
  icon: React.ComponentType<any>;
  href?: never;
  onClick: () => void;
  danger?: boolean;
  type?: never;
};

export type MenuItem = MenuItemDivider | MenuItemLink | MenuItemButton;
