import { httpClient } from "@/Infra/httpclient";

class UsecaseAdicionarUtente {
  static endpoint: string = "/utentes";

  static async store(data: any) {
    const response = await httpClient.post(this.endpoint, data);
    return response;
  }
}

export { UsecaseAdicionarUtente };
