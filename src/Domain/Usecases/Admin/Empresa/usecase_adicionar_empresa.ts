import { ModelEmpresa } from "@/Domain/Models/Admin/model_empresa";
import { httpClient } from "@/Infra/httpclient";

class UsecaseAdicioanrEmpresas {
  static endpoint: string = "/admin/companies";

  static async store(data: ModelEmpresa) {
    const response = await httpClient.post(this.endpoint, data);
    return response;
  }
}

export { UsecaseAdicioanrEmpresas };
