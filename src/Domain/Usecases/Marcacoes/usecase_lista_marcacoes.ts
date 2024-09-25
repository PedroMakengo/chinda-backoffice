import { httpClient } from "@/Infra/httpclient";

class UsecaseListaMarcacoes {
  static endpoint: string = "/marcacoes/";

  static async handler(query?: string) {
    const response = await httpClient.get(this.endpoint + query);
    return response;
  }
}

export { UsecaseListaMarcacoes };
