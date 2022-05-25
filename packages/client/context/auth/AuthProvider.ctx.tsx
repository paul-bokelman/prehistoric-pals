import type { FC, ReactNode } from "react";
import type { AuthenticatedUser } from "lib/sdk";
import { useReducer, createContext, useContext, useMemo } from "react";
import Cookie from "js-cookie";
import { ppals } from "lib/sdk";
import {
  authReducer,
  AuthReducerActionTypes,
  AuthProviderState,
} from "context/auth";

// chain context needs to set user on connection from this provider

interface AuthContext extends AuthProviderState {}

const AuthContext = createContext<AuthContext | undefined>(undefined);

export const useAuthContext = (): AuthContext => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be within AuthProvider");
  }
  return context;
};

export const AuthProvider: FC<{
  sessionUser: AuthenticatedUser | null;
  children: ReactNode;
}> = ({ sessionUser, children }) => {
  const [{ user }, dispatch] = useReducer(authReducer, {
    user: sessionUser,
  });

  //   dispatch({type: AuthReducerActionTypes.setUser, payload: USER});

  const value = useMemo(
    () => ({
      user,
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
