export interface EntityPermissoes {
  id: string;
  codigo: string;
  active: boolean;
  senha: string;
  email: string;
  nome: string;
  empresas: Empresa[];
  areas: Area[];
  superAdministrator: boolean;
  administrator: boolean;
  perfis: Perfi[];
  permissoes: Permiss[];
}

export interface Empresa {
  id: string;
  codigo: string;
  nome: string;
  nif: string;
  email: string;
  ligaErp: boolean;
  codEmpErp: string;
  ficheiro: string;
  nomeFile: string;
  produtos: Produto[];
}

export interface Produto {
  id: string;
  nproduto: number;
  produto: string;
}

export interface Area {
  id: string;
  codigo: string;
  descricao: string;
}

export interface Perfi {
  id: number;
  name: string;
  description: string;
}

export interface Permiss {
  name: string;
  description: string;
  id: number;
}
