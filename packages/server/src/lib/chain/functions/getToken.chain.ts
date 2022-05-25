import type { Metadata } from "lib";
import { initializeChain } from "lib/chain";

type GetTokenArgs = { id: number; contract: "dino" | "scenery" };
type GetTokenPayload = string; // Metadata is fetched
type GetToken = ({ id, contract }: GetTokenArgs) => Promise<GetTokenPayload>;

export const getToken: GetToken = async ({ id, contract }) => {
  const { contracts } = await initializeChain();
  const contractInstance = contracts[contract];
  try {
    const uri = await contractInstance.tokenURI(id);
    return uri;
  } catch (error) {
    throw new Error(error.message || error);
  }
};
