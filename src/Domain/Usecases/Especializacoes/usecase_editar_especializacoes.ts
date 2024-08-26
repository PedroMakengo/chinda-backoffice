import { httpClient } from "@/Infra/httpclient";

class UsecaseEditarEspecializacoes {
  static endpoint: string = "/especializacoes/";

  static async store(id: string, data: any) {
    const response = await httpClient.put(this.endpoint + id, data);
    return response;
  }
}

export { UsecaseEditarEspecializacoes };
