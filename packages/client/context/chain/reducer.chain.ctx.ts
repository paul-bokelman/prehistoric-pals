import type { providers } from "ethers";
import { Reducer } from "react";

type Signer = providers.JsonRpcSigner;

export enum ChainReducerActionTypes {
  setProvider = "setProvider",
  setSigner = "setSigner",
  setAddress = "setAddress",
}

export type ChainReducerAction =
  | {
      type: ChainReducerActionTypes.setProvider;
      payload: ChainProviderState["provider"];
    }
  | {
      type: ChainReducerActionTypes.setAddress;
      payload: ChainProviderState["address"];
    }
  | {
      type: ChainReducerActionTypes.setSigner;
      payload: ChainProviderState["signer"];
    };

export interface ChainProviderState {
  provider: providers.Web3Provider | null;
  signer: Signer | null;
  address: string | null;
}

export type ChainReducer = Reducer<ChainProviderState, ChainReducerAction>;

export const chainReducer: Reducer<ChainProviderState, ChainReducerAction> = (
  state,
  action
) => {
  switch (action.type) {
    case ChainReducerActionTypes.setProvider:
      return { ...state, provider: action.payload };
    case ChainReducerActionTypes.setAddress:
      return { ...state, address: action.payload };
    case ChainReducerActionTypes.setSigner:
      return { ...state, signer: action.payload };
    default:
      throw new Error(`Unhandled action type`);
  }
};
