import { User } from "@prisma/client";
import type { NextFunction, Request, Response } from "express";
import { decode, Jwt } from "jsonwebtoken";
import { prisma } from "config";

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const auth = req.headers.authorization.split("Bearer ")[1];

  const token = decode(auth, { complete: true }) as Jwt & { payload: User };

  const user = await prisma.user.findUnique({
    where: {
      id: token.payload.id,
    },
  });

  if (!user) return res.status(401).json({ message: "Invalid token" });

  return res.status(200).json(user);
};
