import dotenv from "dotenv";
import S3 from "aws-sdk/clients/s3";

dotenv.config({ path: ".env.development" });

const params = {
  region: "us-west-1",
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
};

export const s3 = new S3({
  region: params.region,
  credentials: {
    accessKeyId: params.accessKeyId,
    secretAccessKey: params.secretAccessKey,
  },
});
