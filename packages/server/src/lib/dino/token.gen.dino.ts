import type Jimp from "jimp";
import fs from "fs";
import jimp from "jimp";
import { uploadToken } from "lib/bucket";
import { randomHex, replaceColors } from "lib/utils";
import { generateMetadata, attributes, colors } from ".";

type GetAssetPath = ({
  type,
  category,
  name,
}: {
  type: string;
  category: string;
  name: string;
}) => string | null;

export type AssetCombination = Array<{
  path: string;
  type: string;
  category?: string;
  name?: string;
  colors?: { primary: string; secondary: string };
}>;

const getAssetPath: GetAssetPath = ({ type, category, name }) => {
  if (name === null) return null;
  function capitalize(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  const getAssetName = (): string => {
    const assetName = `${capitalize(category)} - ${capitalize(name)}`;
    return assetName;
  };

  const asset = `./src/lib/assets/${type}/${category}/${getAssetName()}.png`;

  if (!fs.existsSync(asset)) {
    throw new Error(`Asset ${asset} does not exist`);
  }
  return asset;
};

const getRandomAssetCombination = (): AssetCombination => {
  const needsColors = ["body", "accessories"];
  const assetCombination: AssetCombination = [
    {
      type: "body",
      colors: { primary: randomHex(), secondary: randomHex() },
      path: `./src/lib/assets/Body.png`,
    },
  ];
  const assetTypes = Object.keys(attributes);
  for (const type of assetTypes) {
    const assetCategories = Object.keys(attributes[type]);
    for (const category of assetCategories) {
      const assetNames = Object.keys(attributes[type][category]);
      const randomAssetName =
        assetNames[Math.floor(Math.random() * assetNames.length)];
      assetCombination.push({
        path: getAssetPath({
          type,
          category,
          name: attributes[type][category][randomAssetName],
        }),
        type,
        category,
        name: attributes[type][category][randomAssetName],
        ...(needsColors.includes(type)
          ? { colors: { primary: randomHex(), secondary: randomHex() } }
          : {}),
      });
    }
  }
  return assetCombination;
};

const stitchAssets = async ({
  combination,
}: {
  combination: AssetCombination;
}): Promise<Buffer> => {
  const assets: Array<jimp> = [];
  for (const asset of combination) {
    if (asset.path === null) continue;
    if (asset?.colors) {
      const img = (await replaceColors({
        image: asset.path,
        colors: [
          {
            target: colors["current"][asset.type].primary,
            replacement: asset.colors.primary,
          },
          {
            target: colors["current"][asset.type].secondary,
            replacement: asset.colors.secondary,
          },
        ],
      })) as Jimp;
      assets.push(img);
      continue;
    }
    assets.push(await jimp.read(asset.path));
  }

  const body = assets[0];

  for (const asset of assets.slice(1)) {
    body.composite(asset, 0, 0);
  }

  return body.getBufferAsync(jimp.MIME_PNG);
};

export const generateToken = async ({
  tokenId,
}: {
  tokenId: number;
}): Promise<string> => {
  const combination = getRandomAssetCombination();
  try {
    const dino = await stitchAssets({ combination });
    const meta = await generateMetadata({ tokenId, combination });

    const uploadPayload = {
      id: tokenId,
      image: dino,
      meta: meta.buffer,
    };

    const uri = await uploadToken(uploadPayload);
    return uri;
  } catch (e) {
    console.log(e);
  }
};
