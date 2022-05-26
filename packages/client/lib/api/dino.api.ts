import axios from "axios";
import { url } from ".";

import { Metadata } from "../../../server/src/lib"; // path alias please, this should also come from route as payload type

type GenerateDinoPayload = {
  tokenId: number;
  uri: string;
};
type GenerateDino = () => Promise<GenerateDinoPayload>;
type GetDino = ({ tokenId }: { tokenId: number }) => Promise<Metadata>;

export interface DinoSDK {
  get: GetDino;
  generate: GenerateDino;
}

const generate: GenerateDino = async () => {
  try {
    const { data } = await axios.get<GenerateDinoPayload>(
      url("/dino/generate")
    );
    return data;
  } catch (error: any) {
    console.log(error);
    throw new Error("An error occurred generating dino");
  }
};

const get: GetDino = async ({ tokenId }) => {
  try {
    const { data } = await axios.get<Metadata>(url(`/dino/${tokenId}`));
    return data;
  } catch (error: any) {
    console.log(error);
    throw new Error("An error occurred fetching dino");
  }
};

export const dino: DinoSDK = {
  get,
  generate,
};
