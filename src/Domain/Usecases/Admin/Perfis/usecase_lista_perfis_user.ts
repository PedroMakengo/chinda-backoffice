import { httpClient } from "@/Infra/httpclient";

class UsecaseObterListaPerfisUtilizador {
  static endpoint: string = "/admin/users/perfis?id=";

  static async handler(id: string) {
    const response = await httpClient.get(this.endpoint + id);
    return response;
  }
}

export { UsecaseObterListaPerfisUtilizador };
