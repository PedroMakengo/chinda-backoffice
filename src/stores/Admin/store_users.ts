import { ModelPerfil } from "@/Domain/Models/Admin/model_associcao_perfil";
import { ModelPermissoes } from "@/Domain/Models/Admin/model_associcao_permissoes";
import { ModelEmpresa } from "@/Domain/Models/Admin/model_empresa";
import { ModelUser } from "@/Domain/Models/Admin/model_user";
import { UsecaseAdicioanrEmpresas } from "@/Domain/Usecases/Admin/Empresa/usecase_adicionar_empresa";
import { UsecaseAtualizarEmpresas } from "@/Domain/Usecases/Admin/Empresa/usecase_atualizar_empresa";
import { UsecaseObterListaEmpresas } from "@/Domain/Usecases/Admin/Empresa/usecase_lista_empresas";
import { UsecaseAdicionarPerfil } from "@/Domain/Usecases/Admin/Perfis/usecase_adicionar_perfil";
import { UsecaseObterListaPerfis } from "@/Domain/Usecases/Admin/Perfis/usecase_lista_perfis";
import { UsecaseAdicionarAssociacaoPerfil } from "@/Domain/Usecases/Admin/Users/usecase_adicionar_associacao_perfil";
import { UsecaseAdicionarAssociacaoPermissoes } from "@/Domain/Usecases/Admin/Users/usecase_adicionar_associacao_permissoes";
import { UsecaseAdicionarUtilizador } from "@/Domain/Usecases/Admin/Users/usecase_adicionar_utilizador";
import { UsecaseAtualizarUtilizador } from "@/Domain/Usecases/Admin/Users/usecase_atualizar_utilizador";
import { UsecaseObterListaUtilizadores } from "@/Domain/Usecases/Admin/Users/usecase_lista_utilizadores";

import { defineStore } from "pinia";
import { ref, onMounted } from "vue";

export const useStoreUtilizadores = defineStore("storeUsers", () => {
  const dataUsers = ref<any>([]);
  const dataPerfis = ref<any>([]);
  const dataEmpresas = ref<any>([]);

  // Select
  async function buscarListaUtilizadores() {
    try {
      const response = await UsecaseObterListaUtilizadores.handler();
      dataUsers.value = response.object;
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  async function buscarListaPerfis() {
    try {
      const response = await UsecaseObterListaPerfis.handler();
      dataPerfis.value = response.object;
      dataPerfis.value.forEach((item: any) => {
        item["perfil"] = true;
      });
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  async function buscarListaEmpresas() {
    try {
      const response = await UsecaseObterListaEmpresas.handler();
      dataEmpresas.value = response.object;
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  // Create
  async function adicionarEmpresa(data: ModelEmpresa) {
    try {
      const response = await UsecaseAdicioanrEmpresas.store(data);

      await buscarListaEmpresas();

      return response;
    } catch (error) {
      console.log(error);
    }
  }

  async function adicionarPerfil(data: any) {
    try {
      const response = await UsecaseAdicionarPerfil.store(data);
      await buscarListaPerfis();
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  async function adicionarUtilizador(data: ModelUser) {
    try {
      const response = await UsecaseAdicionarUtilizador.store(data);
      await buscarListaUtilizadores();
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  // Update
  async function atualizarEmpresa(data: ModelEmpresa) {
    try {
      const response = await UsecaseAtualizarEmpresas.store(data);

      await buscarListaEmpresas();

      return response;
    } catch (error) {
      console.log(error);
    }
  }

  async function atualizarUtilizador(data: ModelUser) {
    try {
      const response = await UsecaseAtualizarUtilizador.store(data);

      await buscarListaUtilizadores();

      return response;
    } catch (error) {
      console.log(error);
    }
  }

  async function adicionarPermissoesUtilizador(data: ModelPermissoes) {
    try {
      const response = await UsecaseAdicionarAssociacaoPermissoes.store(data);

      await buscarListaUtilizadores();

      return response;
    } catch (error) {
      console.log(error);
    }
  }

  async function adicionarPerfilUtilizador(data: ModelPerfil) {
    try {
      const response = await UsecaseAdicionarAssociacaoPerfil.store(data);

      await buscarListaUtilizadores();

      return response;
    } catch (error) {
      console.log(error);
    }
  }

  onMounted(() => {
    buscarListaUtilizadores();
    buscarListaPerfis();
    buscarListaEmpresas();
  });

  return {
    dataEmpresas,
    dataUsers,
    dataPerfis,
    buscarListaEmpresas,
    buscarListaPerfis,
    buscarListaUtilizadores,
    adicionarEmpresa,
    adicionarPerfil,
    adicionarUtilizador,
    atualizarEmpresa,
    atualizarUtilizador,
    adicionarPermissoesUtilizador,
    adicionarPerfilUtilizador,
  };
});
