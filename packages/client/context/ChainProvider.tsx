import type { FC, ReactNode } from "react";
import type { providers } from "ethers";
import type {
  Dino as DinoContract,
  Scenery as SceneryContract,
} from "contracts/typechain";
import type { SafeMintPayload } from "lib/chain";
import React, {
  useState,
  createContext,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { initializeChain, safeMint } from "lib/chain";
import { ppals } from "lib/sdk";

type Contracts = {
  dino: DinoContract | null;
  scenery: SceneryContract | null;
};

type Signer = providers.JsonRpcSigner;

interface ChainContext {
  provider: providers.Web3Provider | null;
  contracts: Contracts;
  signer: Signer | null;
  address: string | null;
  mint: ({
    contractName,
  }: {
    contractName: "dino" | "scenery";
  }) => Promise<SafeMintPayload>;
}

const ChainContext = createContext<ChainContext>({
  provider: null,
  contracts: {
    dino: null,
    scenery: null,
  },
  signer: null,
  address: null,
  mint: async ({ contractName }) => {
    return { id: 0, uri: "" };
  },
});

export const useChainContext = (): ChainContext => {
  return useContext(ChainContext);
};

export const ChainProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [provider, setProvider] = useState<providers.Web3Provider | null>(null);
  const [contracts, setContracts] = useState<Contracts>({
    dino: null,
    scenery: null,
  });
  const [signer, setSigner] = useState<Signer | null>(null);
  const [address, setAddress] = useState<string | null>(null);

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

  // const get: ChainContext["get"] = async ({ contractName }) => {};

  useEffect(() => {
    const initChain = async (): Promise<void> => {
      const { provider, signer, address, contracts } = await initializeChain();
      setProvider(provider);
      setContracts(contracts);
      setSigner(signer);
      setAddress(address);
    };

    initChain().catch(console.log);
  }, []);

  const value = useMemo(
    () => ({
      provider,
      contracts,
      signer,
      address,
      mint,
    }),
    [provider, contracts, signer, address, mint]
  );

  return (
    <ChainContext.Provider value={value}>{children}</ChainContext.Provider>
  );
};
