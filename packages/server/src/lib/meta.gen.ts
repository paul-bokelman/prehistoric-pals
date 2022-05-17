import { AssetCombination } from "./token.gen";

type Metadata = {
  name: string;
  description: string;
  image: string;
  attributes: Array<{
    display_type?: string;
    trait_type: string;
    value: string | number | Date;
  }>;
  external_url: string;
};

type GenerateMetadata = ({
  tokenId,
  combination,
}: {
  tokenId: number;
  combination: AssetCombination;
}) => Promise<{ data: Metadata; buffer: Buffer }>;

const metadata: Metadata = {
  name: "", // bronto #12
  description: "",
  image: "", // url
  attributes: [],
  external_url: "",
};

export const generateMetadata: GenerateMetadata = async ({
  tokenId,
  combination,
}) => {
  const url = process.env.AWS_URL;
  const key = `${tokenId}/${tokenId}`;
  const imageURL = `${url}/${key}.png`;

  const attributes = combination.reduce((result, { category, name }) => {
    if (name && category) {
      result.push({
        trait_type: category,
        value: name,
      });
    }
    return result;
  }, []);

  const bday = { trait_type: "birthday", value: new Date() };

  let meta: Metadata = {
    name: `Dino #${tokenId}`,
    description: "Dino's are massively customizable crypto creatures.",
    image: imageURL,
    attributes: [bday, ...attributes],
    external_url: `${process.env.URL}/dino/${tokenId}`,
  };

  const buff = Buffer.from(JSON.stringify(meta, null, 2));

  return { data: meta, buffer: buff };
};
