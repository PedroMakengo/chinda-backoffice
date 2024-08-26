import { httpClient } from "@/Infra/httpclient";

class UsecaseListaPerfis {
  static endpoint: string = "/perfis";

  static async handler(query?: string) {
    const response = await httpClient.get(this.endpoint + query);
    return response;
  }
}

export { UsecaseListaPerfis };
