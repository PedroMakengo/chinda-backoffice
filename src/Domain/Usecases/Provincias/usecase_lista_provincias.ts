import { httpClient } from "@/Infra/httpclient";

class UsecaseListaProvincias {
  static endpoint: string = "/provincias";

  static async handler(query?: string) {
    const el = query === undefined ? "" : query;
    const response = await httpClient.get(this.endpoint + el);
    return response;
  }
}

export { UsecaseListaProvincias };
