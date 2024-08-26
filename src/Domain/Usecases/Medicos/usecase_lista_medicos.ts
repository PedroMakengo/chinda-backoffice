import { httpClient } from "@/Infra/httpclient";

class UsecaseListaMedicos {
  static endpoint: string = "/medicos";

  static async handler(query?: string) {
    const response = await httpClient.get(this.endpoint + query);
    return response;
  }
}

export { UsecaseListaMedicos };
