import { httpClient } from "@/Infra/httpclient";

class UsecaseListaMedicosPorId {
  static endpoint: string = "/medicos/";

  static async handler(id: number | string) {
    const response = await httpClient.get(this.endpoint + id);
    return response;
  }
}

export { UsecaseListaMedicosPorId };
