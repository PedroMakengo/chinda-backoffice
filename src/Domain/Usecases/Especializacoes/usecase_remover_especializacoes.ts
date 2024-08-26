import { httpClient } from "@/Infra/httpclient";

class UsecaseDeleteEspecializacoes {
  static endpoint: string = "/especializacoes/";

  static async store(id: string) {
    const response = await httpClient.delete(this.endpoint + id, {});
    return response;
  }
}

export { UsecaseDeleteEspecializacoes };
