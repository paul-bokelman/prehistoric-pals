import express from "express";
import * as controller from ".";

export const dinoRouter = express.Router();

dinoRouter.route("/generate").get(controller.generate);

dinoRouter.route("/:id").get(controller.get);
