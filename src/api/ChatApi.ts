import { ApiClient } from "./ApiClient";
import { ClientErr, Err, Ok, Result } from "./ApiUtils";

export type ChatResponse = {
  id: number;
  prompt: string;
  response: string;
}

type RawChatSession = {
  id: number;
  user_id: number;
}

type ChatApiCommonPayload = {
  accessToken: string;
}

type CreateChatPayload = {
  prompt: string;
  sessionId: number
} & ChatApiCommonPayload;

type CreateChatSessionResult = Result<number, ClientErr>;
type CreateChatResult = Result<ChatResponse, ClientErr>;
type DeleteChatResult = Result<unknown, ClientErr>;


export class ChatApi {
  constructor(private readonly client: ApiClient) { }

  async createChatSession({ accessToken }: ChatApiCommonPayload): Promise<CreateChatSessionResult> {
    const path = '/session';

    const result = await this.client.post<RawChatSession>(path, {}, { Authorization: `Bearer ${accessToken}` });
    if (result.isOk()) {
      return new Ok(result.unwrap().id);
    }
    return result as Err<any, ClientErr>;

  }

  async createChat({ prompt, accessToken, sessionId }: CreateChatPayload): Promise<CreateChatResult> {
    const path = `/session/${sessionId}/chat`;
    return await this.client.post<ChatResponse>(path, { prompt }, { Authorization: `Bearer ${accessToken}` });
  }

  async updateChat(id: number, { prompt, sessionId, accessToken }: CreateChatPayload): Promise<CreateChatResult> {
    const path = `/session/${sessionId}/chat/${id}`;
    return await this.client.put<ChatResponse>(path, { prompt }, { Authorization: `Bearer ${accessToken}` });
  }

  async deleteChat(id: number, { sessionId, accessToken }: Omit<CreateChatPayload, 'prompt'>): Promise<DeleteChatResult> {
    const path = `/session/${sessionId}/chat/${id}`;
    return await this.client.delete(path, { Authorization: `Bearer ${accessToken}` });
  }
}
