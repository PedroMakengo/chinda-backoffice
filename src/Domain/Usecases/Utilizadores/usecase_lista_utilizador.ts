import { httpClient } from "@/Infra/httpclient";

class UsecaseObterListaMedicoLogado {
  static endpoint: string = "/utilizadores/token";

  static async handler() {
    const response = await httpClient.get(this.endpoint);
    return response;
  }
}

export { UsecaseObterListaMedicoLogado };
