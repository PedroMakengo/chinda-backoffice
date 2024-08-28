import { httpClient } from "@/Infra/httpclient";
import { authStore } from "@/stores/store_autenticacao";
import { defineStore } from "pinia";

export const storeAutenticacao = defineStore("UsecaseAutenticacao", () => {
  // Função para login
  async function login(username: string, password: string) {
    try {
      const data = {
        email: username,
        palavraPasse: password,
      };

      const response = await httpClient.post("login", data);

      const token = response.object;

      if (response?.statusCode === 200) {
        if (token) {
          authStore.salvarToken(token);
        }
      }

      const utilizador = await getDadosDoUtilizador();

      return { response, utilizador };
    } catch (error) {
      console.log(error);
    }
  }

  // Função para adicionar usuário no store
  async function setUtilizador(utilizador: any) {
    authStore.salvarUtilizador(utilizador);
  }

  // Função para pegar usuário
  async function getDadosDoUtilizador() {
    try {
      const { object } = await httpClient.get("utilizadores/token");
      return object;
    } catch (error) {
      console.error("Erro ao verificar o token: ", error);
    }
  }

  return {
    login,
    setUtilizador,
    getDadosDoUtilizador,
  };
});
