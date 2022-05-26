import type { providers } from "ethers";

declare global {
  interface Window {
    ethereum: any;
  }
}

type GetSignerPayload = providers.JsonRpcSigner;
type GetSignerArgs = { provider: providers.Web3Provider; address: string };
type GetSigner = ({ provider, address }: GetSignerArgs) => GetSignerPayload;

export const getSigner: GetSigner = ({ provider, address }) => {
  if (window.ethereum) {
    const signer = provider.getSigner(address);
    return signer;
  } else {
    throw new Error(
      "Non-Ethereum browser detected. You should consider trying MetaMask"
    );
  }
};
