import { httpClient } from "@/Infra/httpclient";

class UsecaseListaMedicosEspecializacao {
  static endpoint: string = "/";

  static async handler(especializacao: number) {
    const response = await httpClient.get(
      this.endpoint + especializacao + "/medicos"
    );
    return response;
  }
}

export { UsecaseListaMedicosEspecializacao };
