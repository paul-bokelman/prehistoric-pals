import axios from "axios";
import { url } from ".";

type GetNoncePayload = {
  address: string;
  nonce: string;
  signMessage: string;
};
type GetNonce = ({ address }: { address: string }) => Promise<GetNoncePayload>;

type SignPayload = {
  success: boolean;
  token: string;
};
type Sign = ({
  address,
  signature,
}: {
  address: string;
  signature: string;
}) => Promise<SignPayload>;

export interface AuthSDK {
  nonce: GetNonce;
  sign: Sign;
}

const nonce: GetNonce = async ({ address }) => {
  try {
    const { data } = await axios.get<GetNoncePayload>(
      url(`/auth/${address}/nonce`),
      { withCredentials: true }
    );
    return data;
  } catch (error: any) {
    console.log(error);
    throw new Error("An error occurred fetching/generating nonce");
  }
};

const sign: Sign = async ({ address, signature }) => {
  try {
    const { data } = await axios.post<SignPayload>(
      url(`/auth/${address}/signature`),
      { signature },
      { withCredentials: true }
    );
    return data;
  } catch (error: any) {
    console.log(error);
    throw new Error("An error occurred signing");
  }
};

export const auth: AuthSDK = {
  nonce,
  sign,
};
