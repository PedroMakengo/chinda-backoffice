import { httpClient } from "@/Infra/httpclient";

class UsecaseAdicionarEspecializacoes {
  static endpoint: string = "/especializacoes/";

  static async store(data: any) {
    const response = await httpClient.post(this.endpoint, data);
    return response;
  }
}

export { UsecaseAdicionarEspecializacoes };
