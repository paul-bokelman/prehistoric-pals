import type { NextFunction, Request, Response } from "express";
import axios from "axios";
import type { Metadata } from "lib";
import { getToken } from "lib/chain";

export const getDino = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      error: "Missing id",
    });
  }

  try {
    const uri = await getToken({ id: parseInt(id), contract: "dino" });

    const { data: metadata }: { data: Metadata } = await axios.get(uri);

    return res.status(200).json(metadata);
  } catch (error: any) {
    console.log(error);
    if (error.code === "NoSuchKey") {
      return res.status(404).json({ error: `Dino ${id} not found` });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
};
