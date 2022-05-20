import express from "express";
import { dinoRouter } from "./dino";
import { authRouter } from "./auth";

export const services = express.Router();

services.use("/dino", dinoRouter);
services.use("/auth", authRouter);
