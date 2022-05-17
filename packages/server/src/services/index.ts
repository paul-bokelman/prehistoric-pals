import express from "express";

import { dinoRouter } from "./dino";

export const services = express.Router();

services.use("/dino", dinoRouter);
