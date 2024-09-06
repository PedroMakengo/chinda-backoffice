import axios, { AxiosInstance, AxiosResponse } from "axios";
import { authStore } from "@/stores/store_autenticacao";

interface HttpResponse {
  statusCode: number;
  object?: any;
  success: boolean;
}

interface IHttpClient {
  get(url: string): Promise<HttpResponse>;
  post(url: string, body: any): Promise<HttpResponse>;
  put(url: string, body: any): Promise<HttpResponse>;
  delete(url: string, body: any): Promise<HttpResponse>;
  patch(url: string, body: any): Promise<HttpResponse>;
}

class AxiosHttpClient implements IHttpClient {
  private instance: AxiosInstance = axios.create({
    baseURL: "http://chinda.isfactory.app/chinda/",
  });

  constructor() {
    this.instance.interceptors.request.use(
      async (request: any): Promise<any> => {
        const token = await authStore.obterToken();

        // Verifica se os cabeçalhos já existem, se não, cria um novo objeto para eles
        if (!request.headers) {
          request.headers = {};
        }

        // Adiciona o cabeçalho Authorization
        if (token && token.token) {
          request.headers["Authorization"] = "Bearer" + ` ${token.token}`;
        }

        // Adiciona o cabeçalho Content-Type
        request.headers["Content-Type"] = "application/json";

        return request;
      }
    );
  }

  // Error
  private handleError(error: any): HttpResponse {
    const response: AxiosResponse | undefined = error.response;

    return {
      statusCode: response ? response.status : 500,
      object: response ? response.data : undefined,
      success: false,
    };
  }

  // Converte HttResponse
  private convertToHttpResponse(response: AxiosResponse): HttpResponse {
    return {
      statusCode: response.status,
      object: response.data,
      success: response.status >= 200 && response.status < 300,
    };
  }

  async get(url: string): Promise<HttpResponse> {
    try {
      const response: AxiosResponse = await this.instance.get(url);
      return this.convertToHttpResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async post(url: string, body: any): Promise<HttpResponse> {
    try {
      const response: AxiosResponse = await this.instance.post(url, body);
      return this.convertToHttpResponse(response);
    } catch (error) {
      console.log(error);
      return this.handleError(error);
    }
  }

  async put(url: string, body: any): Promise<HttpResponse> {
    try {
      const response: AxiosResponse = await this.instance.put(url, body);
      return this.convertToHttpResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async delete(url: string, body: any): Promise<HttpResponse> {
    try {
      const response: AxiosResponse = await this.instance.delete(url, body);
      return this.convertToHttpResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async patch(url: string, body: any): Promise<HttpResponse> {
    try {
      const response: AxiosResponse = await this.instance.patch(url, body);
      return this.convertToHttpResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }
}

export const httpClient: IHttpClient = new AxiosHttpClient();
