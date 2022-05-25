import express from "express";
import passport from "passport";
import * as controller from "./controller";
import { isAuthenticated } from "lib/passport";

export const userRouter = express.Router();

// userRouter.use(passport.authenticate("jwt", { session: true }));

// userRouter.route("/").get(controller.getUser);
userRouter.get("/", isAuthenticated, controller.getUser);
