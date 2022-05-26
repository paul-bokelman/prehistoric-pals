import type { AuthenticatedUser } from "lib/api";
import { Reducer } from "react";

export enum AuthReducerActionTypes {
  setUser = "setUser",
  setLoggedIn = "setLoggedIn",
}

export type AuthReducerAction =
  | {
      type: AuthReducerActionTypes.setUser;
      payload: AuthProviderState["user"];
    }
  | {
      type: AuthReducerActionTypes.setLoggedIn;
      payload: AuthProviderState["loggedIn"];
    };

export interface AuthProviderState {
  user: AuthenticatedUser | null;
  loggedIn: boolean;
}

export type AuthReducer = Reducer<AuthProviderState, AuthReducerAction>;

export const authReducer: Reducer<AuthProviderState, AuthReducerAction> = (
  state,
  action
) => {
  switch (action.type) {
    case AuthReducerActionTypes.setUser:
      return { ...state, user: action.payload };
    case AuthReducerActionTypes.setLoggedIn:
      return { ...state, loggedIn: action.payload };
    default:
      throw new Error(`Unhandled action type`);
  }
};
