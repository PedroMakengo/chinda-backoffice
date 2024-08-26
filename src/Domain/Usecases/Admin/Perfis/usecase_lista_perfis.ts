import { httpClient } from "@/Infra/httpclient";

class UsecaseObterListaPerfis {
  static endpoint: string = "/admin/perfis";

  static async handler() {
    const response = await httpClient.get(this.endpoint);
    return response;
  }
}

export { UsecaseObterListaPerfis };
