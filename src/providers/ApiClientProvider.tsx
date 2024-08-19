import { createContext, PropsWithChildren } from "react";
import axios from "axios";
import { ApiClient } from "../api/ApiClient";


type ProviderProp = PropsWithChildren
export const ApiClientContext = createContext<ApiClient>({} as ApiClient);

export const ApiClientContextProvider = ({ children }: ProviderProp) => {
  const clientInstance = axios.create({
    baseURL: 'https://chatbot-backend-0e1i.onrender.com/api/v1',
    headers: {
      'Content-Type': 'application/json',
    }
  });

  return (
    <ApiClientContext.Provider value={new ApiClient(clientInstance)} >
      {children}
    </ApiClientContext.Provider>);
}

