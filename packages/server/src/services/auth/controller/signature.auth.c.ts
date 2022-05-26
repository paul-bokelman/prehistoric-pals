import type { NextFunction, Request, Response } from "express";
import { sign } from "jsonwebtoken";
import { prisma } from "config";
import { generateNonce, validateSignature } from "lib/auth/utils";

export const signNonce = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { address } = req.params;
  const { signature } = req.body;

  if (!address) {
    return res.status(400).json({
      error: "Address is required",
    });
  }

  try {
    const valid = await validateSignature({ address, signature });

    if (!valid) return res.status(401).json({ message: "Invalid signature" });

    const user = await prisma.user.update({
      where: { address },
      data: {
        nonce: generateNonce().nonce,
      },
    });

    const token = sign(
      {
        id: user.id,
        address: user.address,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );

    console.log(token);

    res.cookie("token", token, {
      secure: false,
      maxAge: 36000000,
      sameSite: "strict",
      httpOnly: true,
    });

    return res.status(200).json({
      success: true,
      token: token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};
