import type { FC, ReactNode } from "react";
import type { AuthenticatedUser } from "lib/api";
import { useReducer, createContext, useContext, useMemo } from "react";
import {
  authReducer,
  AuthReducerActionTypes,
  AuthProviderState,
} from "context/auth";

interface AuthContext extends AuthProviderState {
  setUser: (user: AuthProviderState["user"]) => Promise<void>;
}

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
  const [{ user, loggedIn }, dispatch] = useReducer(authReducer, {
    user: sessionUser,
    loggedIn: !!sessionUser,
  });

  const setUser: AuthContext["setUser"] = async (user) => {
    dispatch({ type: AuthReducerActionTypes.setUser, payload: user });
  };

  const value = useMemo(
    () => ({
      user,
      loggedIn,
      setUser,
    }),
    [user, loggedIn, setUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
