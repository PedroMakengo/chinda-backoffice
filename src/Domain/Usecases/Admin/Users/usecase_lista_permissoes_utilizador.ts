import { httpClient } from "@/Infra/httpclient";

class UsecaseObterListaPermissoes {
  static endpoint: string = "/admin/users/permissoes?Id=";

  static async handler(id: string) {
    const response = await httpClient.get(this.endpoint + id);
    return response;
  }
}

export { UsecaseObterListaPermissoes };
