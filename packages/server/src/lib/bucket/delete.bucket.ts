import { s3 } from "config";

type DeleteToken = ({
  id,
  contract,
}: {
  id: number;
  contract: "dino" | "scenery";
}) => Promise<void>;

// different contract options

export const deleteToken: DeleteToken = async ({ id, contract }) => {
  const bucket = process.env.AWS_BUCKET;

  const key = `${contract}/${id}/${id}`;

  const keys = {
    image: `${key}.png`,
    meta: key,
  };

  try {
    await Promise.all([
      s3.headObject({ Bucket: bucket, Key: keys.image }).promise(),
      s3.headObject({ Bucket: bucket, Key: keys.meta }).promise(),
    ]);
    try {
      await Promise.all([
        s3.deleteObject({ Bucket: bucket, Key: keys.image }).promise(),
        s3.deleteObject({ Bucket: bucket, Key: keys.meta }).promise(),
      ]);
    } catch (err) {
      console.log(err);
    }
  } catch (err) {
    console.log("Error finding file", keys);
  }
};
