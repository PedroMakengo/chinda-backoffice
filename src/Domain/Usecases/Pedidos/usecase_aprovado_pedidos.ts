import { httpClient } from "@/Infra/httpclient";

class UsecaseAprovarPedidosInscricao {
  static endpoint: string = "/pedidos/";

  static async store(data: any, id: string | number) {
    const response = await httpClient.patch(this.endpoint + id, data);
    return response;
  }
}

export { UsecaseAprovarPedidosInscricao };
