import { customAlphabet } from "nanoid";

type GenerateNonce = () => { nonce: string; message: string };
type RetrieveNonce = (nonce: string) => string;

const msg = "Your nonce"; // shitty message tbh
const alphabet =
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

export const generateNonce: GenerateNonce = () => {
  const nonce = customAlphabet(alphabet, 16)();
  return { nonce, message: `${msg}: ${nonce}` };
};

export const retrieveMessage: RetrieveNonce = (nonce) => {
  return `${msg}: ${nonce}`;
};
