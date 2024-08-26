import { httpClient } from "@/Infra/httpclient";

class UsecaseListaPedidos {
  static endpoint: string = "/pedidos";

  static async handler(query?: string) {
    const response = await httpClient.get(this.endpoint + query);
    return response;
  }
}

export { UsecaseListaPedidos };
