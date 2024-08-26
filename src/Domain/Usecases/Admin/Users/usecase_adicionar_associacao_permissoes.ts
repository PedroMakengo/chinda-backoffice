import { ModelPermissoes } from "@/Domain/Models/Admin/model_associcao_permissoes";
import { httpClient } from "@/Infra/httpclient";

class UsecaseAdicionarAssociacaoPermissoes {
  static endpoint: string = "/admin/users/permissoes";

  static async store(data: ModelPermissoes) {
    const response = await httpClient.post(this.endpoint, data);
    return response;
  }
}

export { UsecaseAdicionarAssociacaoPermissoes };
