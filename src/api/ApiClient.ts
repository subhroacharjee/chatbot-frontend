import { AxiosError, AxiosInstance, AxiosResponse, HttpStatusCode } from "axios";
import { ClientErr, Err, Ok, Result } from "./ApiUtils";

type Headers = {
  'Authorization'?: string
}

export class ApiClient {
  constructor(private readonly client: AxiosInstance) { }


  handleResponse<T>(response: AxiosResponse): Result<T, ClientErr> {
    if ([HttpStatusCode.Ok, HttpStatusCode.Created].indexOf(response.status) !== -1) {
      const data = response.data['data'];
      return new Ok(data)
    }

    const errorDetail = response.data['detail'];
    return new Err(new ClientErr(response.status, { errorDetail }));
  }



  async get<T>(path: string, headers?: Headers): Promise<Result<T, ClientErr>> {
    try {
      const resp = await this.client.get(path, { headers });
      return this.handleResponse(resp);
    } catch (error) {
      if (!(error instanceof AxiosError) || !error.response) {
        throw error;
      }

      return this.handleResponse(error.response);
    }
  }

  async post<T>(path: string, body: object, headers?: Headers): Promise<Result<T, ClientErr>> {
    try {
      const resp = await this.client.post(path, body, { headers });
      return this.handleResponse(resp);
    } catch (error) {
      if (!(error instanceof AxiosError) || !error.response) {
        throw error;
      }

      return this.handleResponse(error.response);
    }
  }

  async put<T>(path: string, body: object, headers?: Headers): Promise<Result<T, ClientErr>> {
    try {
      const resp = await this.client.put(path, body, { headers });
      return this.handleResponse(resp);
    } catch (error) {
      if (!(error instanceof AxiosError) || !error.response) {
        throw error;
      }

      return this.handleResponse(error.response);
    }
  }


  async delete<T>(path: string, headers?: Headers): Promise<Result<T, ClientErr>> {
    try {
      const resp = await this.client.delete(path, { headers });
      return this.handleResponse(resp);
    } catch (error) {
      if (!(error instanceof AxiosError) || !error.response) {
        throw error;
      }

      return this.handleResponse(error.response);
    }
  }
}
