import type { providers } from "ethers";
import { ethers } from "ethers";

declare global {
  interface Window {
    ethereum: any;
  }
}

type InitializeChainPayload = {
  provider: providers.Web3Provider;
  signer: providers.JsonRpcSigner;
  address: string;
};
type InitializeChain = () => Promise<InitializeChainPayload>;

export type ChainConfig = {
  provider: providers.Web3Provider;
};

export const initializeChain: InitializeChain = async () => {
  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    await provider.send("eth_requestAccounts", []);
    const [address] = await provider.listAccounts();
    let signer = provider.getSigner(address);

    window.ethereum.on("accountsChanged", (accounts: string[]) => {
      signer = provider.getSigner(accounts[0]);
    });

    window.ethereum.on("chainChanged", (chainId: number) => {
      window.location.reload();
    });

    return { provider, signer, address };
  } else {
    throw new Error(
      "Non-Ethereum browser detected. You should consider trying MetaMask"
    );
  }
};
