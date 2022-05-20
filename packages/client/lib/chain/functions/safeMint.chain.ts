import type { Dino, Scenery } from "contracts/typechain";
import type { providers } from "ethers";
import { ethers } from "ethers";

type SafeMintArgs = {
  tokenId: number;
  signer: providers.JsonRpcSigner;
  contract: Dino | Scenery;
};
export type SafeMintPayload = { id: number; uri: string };
type SafeMint = ({
  tokenId,
  signer,
  contract,
}: SafeMintArgs) => Promise<SafeMintPayload>;

export const safeMint: SafeMint = async ({ tokenId, signer, contract }) => {
  const signerAddress = await signer.getAddress();
  console.log(signerAddress);
  const contractInstance = contract.connect(signer);
  const value = ethers.utils.parseEther(
    // (await contract.name()) === "Dino" ? "15" : "10"
    "15"
  );
  const tx = await contractInstance.safeMint(
    signerAddress,
    `${tokenId}/${tokenId}`,
    {
      value,
    }
  );
  const receipt = await tx.wait();
  console.log(receipt);
  const uri = await contractInstance.tokenURI(tokenId);
  return { id: tokenId, uri };
};
