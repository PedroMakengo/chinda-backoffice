import { httpClient } from "@/Infra/httpclient";

class UsecaseListaEspecializacoes {
  static endpoint: string = "/especializacoes";

  static async handler(query?: string) {
    const el = query === undefined ? "" : query;
    const response = await httpClient.get(this.endpoint + el);
    return response;
  }
}

export { UsecaseListaEspecializacoes };
