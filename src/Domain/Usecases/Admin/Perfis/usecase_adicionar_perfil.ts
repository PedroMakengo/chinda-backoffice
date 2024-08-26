import { httpClient } from "@/Infra/httpclient";

class UsecaseAdicionarPerfil {
  static endpoint: string = "/admin/perfis";

  static async store(data: any) {
    const response = await httpClient.post(this.endpoint, data);
    return response;
  }
}

export { UsecaseAdicionarPerfil };