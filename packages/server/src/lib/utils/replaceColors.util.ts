import type { LAB } from "color-convert/conversions";
import type Jimp from "jimp";
import * as jimp from "jimp";
import convert from "color-convert";
import DeltaE from "delta-e";

type ReplaceColorsArgs = {
  image: string;
  colors: Array<{ target: string; replacement: string }>;
};
type ReplaceColorsPayload = Promise<Jimp>;
type ReplaceColors = ({
  image,
  colors,
}: ReplaceColorsArgs) => ReplaceColorsPayload;

export const replaceColors: ReplaceColors = async ({ image, colors }) => {
  const img = await jimp.read(image);

  colors.forEach((color) => {
    const target = convert.hex.lab(color.target);
    const replacement = convert.hex.rgb(color.replacement);

    img.scan(0, 0, img.bitmap.width, img.bitmap.height, (x, y, idx) => {
      const current = convert.rgb.lab([
        img.bitmap.data[idx],
        img.bitmap.data[idx + 1],
        img.bitmap.data[idx + 2],
      ]);

      if (getDelta(current, target) <= 20) {
        img.bitmap.data[idx] = replacement[0];
        img.bitmap.data[idx + 1] = replacement[1];
        img.bitmap.data[idx + 2] = replacement[2];
      }
    });
  });
  return img;
};

const getDelta = (current: LAB, target: LAB): number => {
  return DeltaE.getDeltaE00(
    { L: current[0], A: current[1], B: current[2] },
    { L: target[0], A: target[1], B: target[2] }
  );
};
