import { httpClient } from "@/Infra/httpclient";

class UsecaseListaPedidosPorId {
  static endpoint: string = "/pedidos?id";

  static async handler(id?: string) {
    const response = await httpClient.get(this.endpoint + id);
    return response;
  }
}

export { UsecaseListaPedidosPorId };
