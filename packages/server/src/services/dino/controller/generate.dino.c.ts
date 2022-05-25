import type { Request, Response, NextFunction } from "express";
import { generateToken } from "lib";
import { initializeChain, mint as mintToken } from "lib/chain";

export const generateDino = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // const { to } = req.body;

  // if (!to) {
  //   return res.status(400).json({
  //     error: "Missing 'to' parameter",
  //   });
  // }

  try {
    const { contracts } = await initializeChain(); // should remove this?
    const tokenId = (await contracts.dino.totalSupply()).add(1).toNumber();
    const uri = await generateToken({ tokenId });
    // const mint = await mintToken({ tokenId, to, contract: "dino" });

    return res.status(200).json({ tokenId, uri });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
