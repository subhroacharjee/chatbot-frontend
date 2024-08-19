import { ApiClient } from "./ApiClient";
import { ClientErr, Err, Ok, Result } from "./ApiUtils";

type RawUserData = {
  access_token: string,
  user: {
    username: string
  }
}

export type UserData = {
  accessToken: string,
  username: string,
}

type UserResult = Result<UserData, ClientErr>;

export class UserApi {
  constructor(private readonly client: ApiClient) { }

  transformRawUserData(data: RawUserData): UserData {
    return {
      accessToken: data.access_token,
      username: data.user.username,
    }
  }

  async login(username: string, password: string): Promise<UserResult> {
    const path = '/auth/login';
    const result = await this.client.post<RawUserData>(path, { username, password });
    if (result.isOk()) {
      return new Ok(this.transformRawUserData(result.unwrap()))
    }
    return result as Err<any, ClientErr>;
  }

  async signup(username: string, password: string): Promise<UserResult> {
    const path = '/auth/signup';
    const result = await this.client.post<RawUserData>(path, { username, password });
    if (result.isOk()) {
      return new Ok(this.transformRawUserData(result.unwrap()))
    }
    return result as Err<any, ClientErr>;
  }
}
