import type { FC, ReactNode } from "react";
import { useReducer, createContext, useContext, useMemo } from "react";
import { initializeChain } from "lib/chain";
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
  const [{ provider, signer, address }, dispatch] = useReducer(chainReducer, {
    provider: null,
    signer: null,
    address: null,
  });

  const connect = async () => {
    try {
      const { provider, signer, address } = await initializeChain();
      dispatch({
        type: ChainReducerActionTypes.setProvider,
        payload: provider,
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
      const { provider, signer, address } = await initializeChain();
      dispatch({
        type: ChainReducerActionTypes.setProvider,
        payload: provider,
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
      signer,
      address,
      connect,
      connectWithSession,
    }),
    [provider, signer, address, connect, connectWithSession]
  );

  return (
    <ChainContext.Provider value={value}>{children}</ChainContext.Provider>
  );
};
