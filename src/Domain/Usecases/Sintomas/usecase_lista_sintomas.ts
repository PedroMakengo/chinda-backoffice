import { httpClient } from "@/Infra/httpclient";

class UsecaseListaSintomas {
  static endpoint: string = "/sintomas";

  static async handler(query?: string) {
    const response = await httpClient.get(this.endpoint + query);
    return response;
  }
}

export { UsecaseListaSintomas };
