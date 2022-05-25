import type { FC, ReactNode } from "react";
import type { SafeMintPayload } from "lib/chain";
import React, { useReducer, createContext, useContext, useMemo } from "react";
import Cookie from "js-cookie";
import { initializeChain, safeMint } from "lib/chain";
import { ppals } from "lib/sdk";
import {
  chainReducer,
  ChainReducerActionTypes,
  ChainProviderState,
} from "context/chain";

interface ChainContext extends ChainProviderState {
  connect: () => Promise<void>;
  mint: ({
    contractName,
  }: {
    contractName: "dino" | "scenery";
  }) => Promise<SafeMintPayload>;
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
  const [{ provider, contracts, signer, address }, dispatch] = useReducer(
    chainReducer,
    {
      provider: null,
      contracts: { dino: null, scenery: null },
      signer: null,
      address: null,
    }
  );

  const mint: ChainContext["mint"] = async ({ contractName }) => {
    const contract = contracts[contractName];
    if (!contract) throw new Error(`Contract ${contractName} not found`);
    if (!signer) throw new Error("Signer not found or null");

    const { tokenId } = await ppals.dino.generate(); // should query with contractName
    if (!tokenId) throw new Error("No token id was returned from generation");

    const { id, uri } = await safeMint({ tokenId, contract, signer });
    console.log(`Minted ${contractName} with id ${id} and uri ${uri}`);
    return { id, uri };
  };

  const connect = async () => {
    try {
      const { provider, signer, address, contracts } = await initializeChain();
      dispatch({
        type: ChainReducerActionTypes.setProvider,
        payload: provider,
      });
      dispatch({
        type: ChainReducerActionTypes.setContracts,
        payload: contracts,
      });
      dispatch({ type: ChainReducerActionTypes.setAddress, payload: address });
      dispatch({ type: ChainReducerActionTypes.setSigner, payload: signer });
      try {
        const { nonce } = await ppals.auth.nonce({ address });
        if (!nonce) throw new Error("Nonce not returned from auth");
        const signature = await signer.signMessage(nonce);
        const { token } = await ppals.auth.sign({ address, signature });
        if (!token) throw new Error("Token not returned from auth");
        // Cookie.set("session", token);
      } catch (e) {
        console.error(e);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const value = useMemo(
    () => ({
      provider,
      contracts,
      signer,
      address,
      connect,
      mint,
    }),
    [provider, contracts, signer, address, mint, connect]
  );

  return (
    <ChainContext.Provider value={value}>{children}</ChainContext.Provider>
  );
};
