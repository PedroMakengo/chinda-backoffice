export interface Utilizador {
  id: string;
  codigo: string;
  nome: string;
  active: boolean;
  email: string;
  areas: [];
  empresas: Empresa[];
}

export interface Empresa {
  codigo: string;
  nome: string;
  nif: string;
  email: string;
  produtos: Produto[];
  ligaErp: boolean;
  codEmpErp: string;
  ficheiro: string;
  nomeFile: string;
  id: string;
}

export interface Produto {
  nproduto: number;
  produto: string;
  id: string;
}
