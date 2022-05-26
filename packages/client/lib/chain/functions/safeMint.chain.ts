import type { Dino, Scenery } from "contracts/typechain";
import type { providers } from "ethers";
import { ethers } from "ethers";

type SafeMintArgs = {
  tokenId: number;
  signer: providers.JsonRpcSigner;
  contract: Dino | Scenery;
};
export type SafeMintPayload = { id: number; uri: string } | undefined;
type SafeMint = ({
  tokenId,
  signer,
  contract,
}: SafeMintArgs) => Promise<SafeMintPayload>;

export const safeMint: SafeMint = async ({ tokenId, signer, contract }) => {
  try {
    const totalSupply = await contract.totalSupply();

    if (tokenId !== totalSupply.toNumber() + 1) {
      // delete associated tokens?
      throw new Error(
        `Disjoint: Meta token id ${tokenId} does not match next token id ${
          totalSupply.toNumber() + 1
        }`
      );
    }

    const signerAddress = await signer.getAddress();
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
  } catch (error) {
    console.error(error);
    return undefined;
  }
};
