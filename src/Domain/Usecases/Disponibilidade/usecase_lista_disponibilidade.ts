import { httpClient } from "@/Infra/httpclient";

class UsecaseObterListaDisponibilidade {
  static endpoint: string = "/";

  static async handler(medico: string | number) {
    const response = await httpClient.get(
      this.endpoint + medico + "/disponibilidade"
    );
    return response;
  }
}

export { UsecaseObterListaDisponibilidade };
