import type { Request, Response, NextFunction } from "express";
import { generateToken } from "lib";

export const mint = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const uri = await generateToken({ tokenId: 12 });
    return res.status(200).json({ uri });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
