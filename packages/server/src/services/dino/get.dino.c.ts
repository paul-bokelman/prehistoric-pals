import type { NextFunction, Request, Response } from "express";
import type { Metadata } from "lib";
import { s3 } from "config";

export const get = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    const obj = await s3
      .getObject({
        Bucket: process.env.AWS_BUCKET,
        Key: `${id}/${id}`,
      })
      .promise();

    const uri: Metadata = JSON.parse(obj.Body.toString());

    return res.status(200).json(uri);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
