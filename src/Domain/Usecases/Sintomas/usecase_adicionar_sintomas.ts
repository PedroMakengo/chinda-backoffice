import { httpClient } from "@/Infra/httpclient";

class UsecaseAdicionarSintomas {
  static endpoint: string = "/sintomas";

  static async store(data: any) {
    const response = await httpClient.post(this.endpoint, data);
    return response;
  }
}

export { UsecaseAdicionarSintomas };
