import { ModelPerfil } from "@/Domain/Models/Admin/model_associcao_perfil";
import { httpClient } from "@/Infra/httpclient";

class UsecaseAdicionarAssociacaoPerfil {
  static endpoint: string = "/admin/users/perfis";

  static async store(data: ModelPerfil) {
    const response = await httpClient.post(this.endpoint, data);
    return response;
  }
}

export { UsecaseAdicionarAssociacaoPerfil };
