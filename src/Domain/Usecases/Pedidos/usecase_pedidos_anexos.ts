import { httpClient } from "@/Infra/httpclient";

class UsecaseListaPedidosAnexos {
  static endpoint: string = "/pedidos/anexos/";

  static async handler(processo: string) {
    const response = await httpClient.get(this.endpoint + processo);
    return response;
  }
}

export { UsecaseListaPedidosAnexos };
