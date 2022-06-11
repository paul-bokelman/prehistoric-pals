import express from "express";
import * as controller from "./controller";
import { isAuthenticated } from "lib/passport";

export const userRouter = express.Router();

userRouter.get("/", isAuthenticated, controller.getUser);
