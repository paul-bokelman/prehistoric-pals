import { ethers } from "ethers";

declare global {
  interface Window {
    ethereum: any;
  }
}

type InitializeChainPayload = {
  provider: ethers.providers.JsonRpcProvider;
  owner: ethers.Signer;
};
type InitializeChain = () => Promise<InitializeChainPayload>;

export const initializeChain: InitializeChain = async () => {
  const provider = new ethers.providers.JsonRpcProvider();

  const owner = provider.getSigner(
    "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266"
  );
  const signer = provider.getSigner(
    "0x70997970c51812dc3a010c7d01b50e0d17dc79c8"
  );

  return { provider, owner };
};
