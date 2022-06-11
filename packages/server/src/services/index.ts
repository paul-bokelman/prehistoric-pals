import express from "express";
import { authRouter } from "./auth";
import { userRouter } from "./user";

export const services = express.Router();

services.use("/auth", authRouter);
services.use("/user", userRouter);
