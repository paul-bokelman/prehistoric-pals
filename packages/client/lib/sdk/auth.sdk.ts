import axios from "axios";
import { url } from ".";

type Error = { error: boolean; message?: string };

type GetNoncePayload = {
  address: string;
  nonce: string;
  signMessage: string;
};
type GetNonce = ({
  address,
}: {
  address: string;
}) => Promise<Partial<GetNoncePayload> & Error>;

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
}) => Promise<Partial<SignPayload> & Error>;

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
    return { error: false, ...data };
  } catch (error: any) {
    console.log(error);
    return { error: true, message: error.message };
  }
};

const sign: Sign = async ({ address, signature }) => {
  try {
    const { data } = await axios.post<SignPayload>(
      url(`/auth/${address}/signature`),
      { signature },
      { withCredentials: true }
    );
    console.log(data);
    return { error: false, ...data };
  } catch (error: any) {
    console.log(error);
    return { error: true, message: error.message };
  }
};

export const auth: AuthSDK = {
  nonce,
  sign,
};
