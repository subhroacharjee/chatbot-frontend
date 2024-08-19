import React, { createContext, PropsWithChildren, useState } from "react";

type AuthStateType = {
  isAuth: boolean,
  token?: string,
};

type AuthContextType = {
  state: AuthStateType,
  action: React.Dispatch<React.SetStateAction<AuthStateType>>,
}

export const AuthContext = createContext({} as AuthContextType);
export const AuthContextProvider = ({ children }: PropsWithChildren) => {
  let defaultVal = false;
  const token = localStorage.getItem('accessToken');
  if (token) {
    defaultVal = true;
  }
  const [authState, setAuthState] = useState<AuthStateType>({ isAuth: defaultVal, token: token === null ? undefined : token });

  const ctx = {
    state: authState,
    action: setAuthState
  }
  return <AuthContext.Provider value={ctx}>{children}</AuthContext.Provider>
}

