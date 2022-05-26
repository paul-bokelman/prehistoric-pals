import type { NextFunction, Request, Response } from "express";
import { getToken } from "lib/chain";
import { deleteToken } from "lib/bucket";

export const deleteDino = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id, contract } = req.params;

  if (!id) {
    return res.status(400).json({
      error: "Missing id",
    });
  }

  if (!contract) {
    return res.status(400).json({
      error: "Missing contract name",
    });
  }

  try {
    // don't delete token if contract has active id

    const uri = await getToken({ id: parseInt(id), contract: "dino" });

    if (uri) {
      return res.status(400).json({
        error: `Token with id of ${id} is active`,
      });
    }

    try {
      await deleteToken({ id: parseInt(id), contract: "dino" });
      return res.status(200).json({ success: true });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error: "Failed to delete token",
      });
    }
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
