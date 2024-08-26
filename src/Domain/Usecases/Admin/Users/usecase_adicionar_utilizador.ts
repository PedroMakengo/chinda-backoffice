import { ModelUser } from "@/Domain/Models/Admin/model_user";
import { httpClient } from "@/Infra/httpclient";

class UsecaseAdicionarUtilizador {
  static endpoint: string = "/admin/users";

  static async store(data: ModelUser) {
    const response = await httpClient.post(this.endpoint, data);
    return response;
  }
}

export { UsecaseAdicionarUtilizador };
