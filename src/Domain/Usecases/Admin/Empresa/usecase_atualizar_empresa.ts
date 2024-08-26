import { ModelEmpresa } from "@/Domain/Models/Admin/model_empresa";
import { httpClient } from "@/Infra/httpclient";

class UsecaseAtualizarEmpresas {
  static endpoint: string = "/admin/companies";

  static async store(data: ModelEmpresa) {
    const response = await httpClient.put(this.endpoint, data);
    return response;
  }
}

export { UsecaseAtualizarEmpresas };
