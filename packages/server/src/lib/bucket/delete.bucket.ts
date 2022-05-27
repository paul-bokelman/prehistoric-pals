import { s3 } from "config";

type DeleteToken = ({ id }: { id: number }) => Promise<void>;

// different contract options

export const deleteToken: DeleteToken = async ({ id }) => {
  const bucket = process.env.AWS_BUCKET;

  const key = `dinos/${id}/${id}`;

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
