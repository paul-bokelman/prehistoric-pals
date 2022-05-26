import type { providers } from "ethers";
import { ethers } from "ethers";
import type {
  Dino as DinoContract,
  Scenery as SceneryContract,
} from "contracts/typechain";
import Dino from "contracts/artifacts/contracts/Dino.sol/Dino.json";
import Scenery from "contracts/artifacts/contracts/Scenery.sol/Scenery.json";

declare global {
  interface Window {
    ethereum: any;
  }
}

type InitializeChainPayload = {
  provider: providers.Web3Provider;
  signer: providers.JsonRpcSigner;
  address: string;
  contracts: {
    dino: DinoContract;
    scenery: SceneryContract;
  };
};
type InitializeChain = () => Promise<InitializeChainPayload>;

export type ChainConfig = {
  provider: providers.Web3Provider;
  contracts: {
    dino: DinoContract;
    scenery: SceneryContract;
  };
};

export const initializeChain: InitializeChain = async () => {
  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    await provider.send("eth_requestAccounts", []);
    const [address] = await provider.listAccounts();
    let signer = provider.getSigner(address);

    const dino = new ethers.Contract(
      process.env.NEXT_PUBLIC_DINO_CONTRACT_ADDRESS || "",
      Dino.abi,
      signer
    ) as DinoContract;

    const scenery = new ethers.Contract(
      process.env.NEXT_PUBLIC_SCENERY_CONTRACT_ADDRESS || "",
      Scenery.abi,
      signer
    ) as SceneryContract;

    window.ethereum.on("accountsChanged", (accounts: string[]) => {
      signer = provider.getSigner(accounts[0]);
    });

    window.ethereum.on("chainChanged", (chainId: number) => {
      window.location.reload();
    });

    return { provider, signer, address, contracts: { dino, scenery } };
  } else {
    throw new Error(
      "Non-Ethereum browser detected. You should consider trying MetaMask"
    );
  }
};
