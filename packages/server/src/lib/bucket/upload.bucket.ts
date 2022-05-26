import { s3 } from "config";

type UploadToken = ({
  id,
  image,
  meta,
}: {
  id: number;
  image: Buffer;
  meta: Buffer;
}) => Promise<string>;

export const uploadToken: UploadToken = async ({ id, image, meta }) => {
  if (image === null) return null;
  if (meta === null) return null;

  const url = process.env.AWS_URL;
  const bucket = process.env.AWS_BUCKET;

  const key = `dinos/${id}/${id}`;
  const imagePayload = {
    Bucket: bucket,
    Key: `${key}.png`,
    Body: image,
    ContentType: "image/png",
    ACL: "public-read",
  };

  const metaPayload = {
    Bucket: bucket,
    Key: `${key}`,
    Body: meta,
    ContentType: "application/json",
    ACL: "public-read",
  };

  try {
    await s3.putObject(imagePayload).promise();
    await s3.putObject(metaPayload).promise();
    return `${url}/${key}`;
  } catch (e) {
    console.log(e);
  }
};
