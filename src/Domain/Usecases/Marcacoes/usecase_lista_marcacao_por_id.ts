import { httpClient } from "@/Infra/httpclient";

class UsecaseListaMarcacoesPorId {
  static endpoint: string = "/marcacoes/";

  static async handler(id?: string) {
    const response = await httpClient.get(this.endpoint + id);
    return response;
  }
}

export { UsecaseListaMarcacoesPorId };
