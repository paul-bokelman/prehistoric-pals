import { ethers } from "ethers";
import { initializeChain } from "lib/chain";

type MintArgs = { tokenId: number; to: string };
type MintPayload = { id: number; uri: string };
type Mint = ({ tokenId, to }: MintArgs) => Promise<MintPayload>;

export const mint: Mint = async ({ tokenId, to }) => {
  const { provider, contract } = await initializeChain();
  const signer = provider.getSigner(to);
  const contractInstance = contract.connect(signer);
  const value = ethers.utils.parseEther("15");
  const tx = await contractInstance.safeMint(to, `${tokenId}/${tokenId}`, {
    value,
  });
  const receipt = await tx.wait();
  console.log(receipt);
  const uri = await contractInstance.tokenURI(tokenId);
  return { id: tokenId, uri };
};
