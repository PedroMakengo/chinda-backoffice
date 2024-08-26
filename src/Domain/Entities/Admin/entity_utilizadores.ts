export interface EntityUtilizador {
  id: string;
  codigo: string;
  active: boolean;
  senha: string;
  email: string;
  nome: string;
  empresas: Empresa[];
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
