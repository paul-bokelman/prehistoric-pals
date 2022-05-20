import { ethers } from "ethers";
import { initializeChain } from "lib/chain";

type MintArgs = { tokenId: number; to: string; contract: "dino" | "scenery" };
type MintPayload = { id: number; uri: string };
type Mint = ({ tokenId, to, contract }: MintArgs) => Promise<MintPayload>;

export const mint: Mint = async ({ tokenId, to, contract }) => {
  const { provider, contracts } = await initializeChain();
  const signer = provider.getSigner(to);
  const contractInstance = contracts[contract].connect(signer);
  const value = ethers.utils.parseEther(contract === "dino" ? "15" : "10");
  const tx = await contractInstance.safeMint(to, `${tokenId}/${tokenId}`, {
    value,
  });
  const receipt = await tx.wait();
  console.log(receipt);
  const uri = await contractInstance.tokenURI(tokenId);
  return { id: tokenId, uri };
};
