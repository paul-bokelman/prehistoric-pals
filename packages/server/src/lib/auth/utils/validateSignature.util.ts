import * as ethUtil from "ethereumjs-util";
import { prisma } from "config";

type ValidateSignature = ({
  address,
  signature,
}: {
  address: string;
  signature: string;
}) => Promise<boolean>;

export const validateSignature: ValidateSignature = async ({
  address,
  signature,
}) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        address,
      },
    });

    if (!user) return false;

    const msgHex = ethUtil.bufferToHex(Buffer.from(user.nonce));
    const msgBuffer = ethUtil.toBuffer(msgHex);
    const msgHash = ethUtil.hashPersonalMessage(msgBuffer);
    const { v, r, s } = ethUtil.fromRpcSig(signature);
    const pubKey = ethUtil.ecrecover(msgHash, v, r, s);
    const addrBuf = ethUtil.publicToAddress(pubKey);
    const sigAddress = ethUtil.bufferToHex(addrBuf);

    if (sigAddress.toLowerCase() === user.address.toLowerCase()) return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
