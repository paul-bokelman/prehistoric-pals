import type { providers } from "ethers";
import type { Dino as DinoContract } from "contracts/typechain";
import { Reducer } from "react";

type Contract = DinoContract | null;

type Signer = providers.JsonRpcSigner;

export enum ChainReducerActionTypes {
  setProvider = "setProvider",
  setSigner = "setSigner",
  setContract = "setContract",
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
    }
  | {
      type: ChainReducerActionTypes.setContract;
      payload: ChainProviderState["contract"];
    };

export interface ChainProviderState {
  provider: providers.Web3Provider | null;
  contract: Contract;
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
    case ChainReducerActionTypes.setContract:
      return { ...state, contract: action.payload };
    default:
      throw new Error(`Unhandled action type`);
  }
};
