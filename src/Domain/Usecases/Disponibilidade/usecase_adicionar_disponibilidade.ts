import { httpClient } from "@/Infra/httpclient";

class UsecaseAdicionarDisponibilidade {
  static endpoint: string = "/dispobilidade/";

  static async store(data: any) {
    const response = await httpClient.post(this.endpoint, data);
    return response;
  }
}

export { UsecaseAdicionarDisponibilidade };
