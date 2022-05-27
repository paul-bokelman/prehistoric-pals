import { initializeChain } from "lib/chain";

type GetTokenArgs = { id: number };
type GetTokenPayload = string | null;
type GetToken = ({ id }: GetTokenArgs) => Promise<GetTokenPayload>;

export const getToken: GetToken = async ({ id }) => {
  const { contract } = await initializeChain();
  try {
    const uri = await contract.tokenURI(id);
    return uri;
  } catch (error) {
    console.log(error);
    return null;
  }
};
