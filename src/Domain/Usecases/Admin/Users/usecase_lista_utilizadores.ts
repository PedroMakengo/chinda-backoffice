import { httpClient } from "@/Infra/httpclient";

class UsecaseObterListaUtilizadores {
  static endpoint: string = "/admin/users";

  static async handler() {
    const response = await httpClient.get(this.endpoint);
    return response;
  }
}

export { UsecaseObterListaUtilizadores };
