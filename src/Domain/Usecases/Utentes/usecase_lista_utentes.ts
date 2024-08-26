import { httpClient } from "@/Infra/httpclient";

class UsecaseListaUtente {
  static endpoint: string = "/utentes";

  static async handler(query?: string) {
    const response = await httpClient.get(this.endpoint + query);
    return response;
  }
}

export { UsecaseListaUtente };
