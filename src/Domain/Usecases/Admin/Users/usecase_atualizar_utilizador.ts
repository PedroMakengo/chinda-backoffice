import { ModelUser } from "@/Domain/Models/Admin/model_user";
import { httpClient } from "@/Infra/httpclient";

class UsecaseAtualizarUtilizador {
  static endpoint: string = "/admin/users";

  static async store(data: ModelUser) {
    const response = await httpClient.put(this.endpoint, data);
    return response;
  }
}

export { UsecaseAtualizarUtilizador };
