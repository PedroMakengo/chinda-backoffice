import { httpClient } from "@/Infra/httpclient";

class UsecaseObterListaPermissoesGeral {
  static endpoint: string = "/admin/permissoes";

  static async handler() {
    const response = await httpClient.get(this.endpoint);
    return response;
  }
}

export { UsecaseObterListaPermissoesGeral };
