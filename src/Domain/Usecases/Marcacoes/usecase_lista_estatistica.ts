import { httpClient } from "@/Infra/httpclient";

class UsecaseDataEstatistica {
  static endpoint: string = "/estatistica/quantidades";

  static async handler() {
    const response = await httpClient.get(this.endpoint);
    return response;
  }
}

export { UsecaseDataEstatistica };
