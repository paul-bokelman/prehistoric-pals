import type { FC, ReactNode } from "react";
import type { SafeMintPayload } from "lib/chain";
import React, { useReducer, createContext, useContext, useMemo } from "react";
import { initializeChain, safeMint } from "lib/chain";
import { api } from "lib/api";
import {
  chainReducer,
  ChainReducerActionTypes,
  ChainProviderState,
} from "context/chain";
import { useAuthContext } from "context/auth";

interface ChainContext extends ChainProviderState {
  connect: () => Promise<void>;
  connectWithSession: () => Promise<void>;
  mint: () => Promise<SafeMintPayload>;
}

const ChainContext = createContext<ChainContext | undefined>(undefined);

export const useChainContext = (): ChainContext => {
  const context = useContext(ChainContext);
  if (context === undefined) {
    throw new Error("useChainContext must be within ChainProvider");
  }

  return context;
};

export const ChainProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { setUser } = useAuthContext();
  const [{ provider, contract, signer, address }, dispatch] = useReducer(
    chainReducer,
    {
      provider: null,
      contract: null,
      signer: null,
      address: null,
    }
  );

  const mint: ChainContext["mint"] = async () => {
    if (!contract) throw new Error(`Contract not found`);
    if (!signer) throw new Error("Signer not found or null");

    try {
      const { tokenId } = await api.dino.generate(); // should query with contractName
      if (!tokenId) throw new Error("Generation error");
      const safeMintResponse = await safeMint({ tokenId, contract, signer });
      if (!safeMintResponse) throw new Error("Mint error");
      const { id, uri } = safeMintResponse;
      console.log(`Minted Dino with id ${id} and uri ${uri}`);
      return { id, uri } as SafeMintPayload;
    } catch (e) {
      console.error(e);
    }
  };

  const connect = async () => {
    try {
      const { provider, signer, address, contract } = await initializeChain();
      dispatch({
        type: ChainReducerActionTypes.setProvider,
        payload: provider,
      });
      dispatch({
        type: ChainReducerActionTypes.setContract,
        payload: contract,
      });
      dispatch({ type: ChainReducerActionTypes.setAddress, payload: address });
      dispatch({ type: ChainReducerActionTypes.setSigner, payload: signer });
      try {
        const { nonce } = await api.auth.nonce({ address });
        if (!nonce) throw new Error("Nonce not returned from auth");
        const signature = await signer.signMessage(nonce);
        const { success, token } = await api.auth.sign({ address, signature });
        if (!success || !token) throw new Error("Signature failed");

        const user = await api.user.get({ token });
        if (!user)
          throw new Error("User doesn't exist or token invalid/expired");

        setUser(user);
      } catch (e) {
        console.error(e);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const connectWithSession = async (): Promise<void> => {
    try {
      const { provider, signer, address, contract } = await initializeChain();
      dispatch({
        type: ChainReducerActionTypes.setProvider,
        payload: provider,
      });
      dispatch({
        type: ChainReducerActionTypes.setContract,
        payload: contract,
      });
      dispatch({ type: ChainReducerActionTypes.setAddress, payload: address });
      dispatch({ type: ChainReducerActionTypes.setSigner, payload: signer });
    } catch (e) {
      console.error(e);
    }
  };

  const value = useMemo(
    () => ({
      provider,
      contract,
      signer,
      address,
      connect,
      connectWithSession,
      mint,
    }),
    [provider, contract, signer, address, mint, connect, connectWithSession]
  );

  return (
    <ChainContext.Provider value={value}>{children}</ChainContext.Provider>
  );
};
