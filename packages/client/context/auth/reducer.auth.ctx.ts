import type { AuthenticatedUser } from "lib/sdk";
import { Reducer } from "react";

export enum AuthReducerActionTypes {
  setUser = "setUser",
}

export type AuthReducerAction = {
  type: AuthReducerActionTypes.setUser;
  payload: AuthProviderState["user"];
};

export interface AuthProviderState {
  user: AuthenticatedUser | null;
}

export type AuthReducer = Reducer<AuthProviderState, AuthReducerAction>;

export const authReducer: Reducer<AuthProviderState, AuthReducerAction> = (
  state,
  action
) => {
  switch (action.type) {
    case AuthReducerActionTypes.setUser:
      return { ...state, user: action.payload };
    default:
      throw new Error(`Unhandled action type`);
  }
};
