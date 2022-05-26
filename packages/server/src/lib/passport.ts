import type { Request, Response, NextFunction } from "express";
import type { User as PrismaUser } from "@prisma/client";
import passport from "passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { prisma } from "config";
import { verify } from "jsonwebtoken";

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser(async ({ id }: PrismaUser, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    done(null, user);
  } catch (error) {
    done(error, false);
  }
});

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(
  new Strategy(opts, async (jwt_payload, done) => {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: jwt_payload.id,
        },
      });
      done(null, user);
    } catch (error) {
      done(error, false);
    }
  })
);

export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization.split("Bearer ")[1];

  if (!token)
    return res.status(401).json({
      error: "No user found or token invalid",
    });

  try {
    verify(token, process.env.JWT_SECRET, {}, (err) => {
      if (err) return res.status(401).json({ error: err.message });
      next();
    });
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      error: "No user found or token invalid",
    });
  }
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization.split("Bearer ")[1];

  if (!token)
    return res.status(401).json({
      error: "No user found or token invalid",
    });

  try {
    verify(
      token,
      process.env.JWT_SECRET,
      {},
      async (err, payload: { id: string; address: string }) => {
        if (err) return res.status(401).json({ error: err.message });

        const user = await prisma.user.findUnique({
          where: {
            id: payload.id,
          },
        });

        if (!user) return res.status(401).json({ error: "No user found" });

        if (user.isAdmin !== true)
          return res.status(401).json({ error: "Not an admin" });

        next();
      }
    );
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      error: "No user found or token invalid",
    });
  }
};
