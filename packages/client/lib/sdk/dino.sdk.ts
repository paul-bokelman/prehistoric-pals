import axios from "axios";
import { url } from ".";

import { Metadata } from "../../../server/src/lib/"; // path alias please, this should also come from route as payload type

type Error = { error: boolean; message?: string };

type GenerateDinoPayload = {
  tokenId: number;
  uri: string;
};
type GenerateDino = () => Promise<Partial<GenerateDinoPayload> & Error>;
type GetDino = ({
  tokenId,
}: {
  tokenId: number;
}) => Promise<Partial<Metadata> & Error>;

export interface DinoSDK {
  get: GetDino;
  generate: GenerateDino;
}

const generate: GenerateDino = async () => {
  try {
    const { data } = await axios.get<GenerateDinoPayload>(
      url("/dino/generate")
    );
    return { error: false, ...data };
  } catch (error: any) {
    console.log(error);
    return { error: true, message: error.message };
  }
};

const get: GetDino = async ({ tokenId }) => {
  try {
    const { data } = await axios.get<Metadata>(url(`/dino/${tokenId}`));
    return { error: false, ...data };
  } catch (error: any) {
    console.log(error);
    return { error: true, message: error.message };
  }
};

export const dino: DinoSDK = {
  get,
  generate,
};
