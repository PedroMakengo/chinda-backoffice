import { httpClient } from "@/Infra/httpclient";

class UsecaseUtilizadorResetPassword {
  static endpoint: string = "/utilizadores/reset-password";

  static async store(data: any) {
    const response = await httpClient.post(this.endpoint, data);
    return response;
  }
}

export { UsecaseUtilizadorResetPassword };
