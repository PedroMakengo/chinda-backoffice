import { httpClient } from "@/Infra/httpclient";

class UsecaseAdicionarPedidos {
  static endpoint: string = "/pedidos";

  static async handler(data: any) {
    const response = await httpClient.post(this.endpoint, data);
    return response;
  }
}

export { UsecaseAdicionarPedidos };
