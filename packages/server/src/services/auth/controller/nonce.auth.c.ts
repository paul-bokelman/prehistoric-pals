import type { NextFunction, Request, Response } from "express";
import { prisma } from "config";
import { generateNonce, retrieveMessage } from "lib/auth/utils";

export const getNonce = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { address } = req.params;

  if (!address) {
    return res.status(400).json({
      error: "Address is required",
    });
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        address,
      },
    });

    if (!user) {
      const { nonce, message: signMessage } = generateNonce();
      try {
        const user = await prisma.user.create({
          data: {
            address,
            nonce,
          },
        });

        // req.session.save((err) => {
        //   console.log(err);
        // });

        return res
          .status(200)
          .json({ address: user.address, nonce: user.nonce, signMessage });
      } catch (e) {
        return res.status(500).json({ message: "failed to create user" });
      }
    }

    return res.status(200).json({
      address: user.address,
      nonce: user.nonce,
      signMessage: retrieveMessage(user.nonce),
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
