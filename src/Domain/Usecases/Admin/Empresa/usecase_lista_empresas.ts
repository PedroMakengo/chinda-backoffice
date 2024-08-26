import { httpClient } from "@/Infra/httpclient";

class UsecaseObterListaEmpresas {
  static endpoint: string = "/admin/companies";

  static async handler() {
    const response = await httpClient.get(this.endpoint);
    return response;
  }
}

export { UsecaseObterListaEmpresas };
