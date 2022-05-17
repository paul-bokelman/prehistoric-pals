import express from "express";
import * as controller from ".";

export const dinoRouter = express.Router();

dinoRouter.route("/mint").post(controller.mint);

/** GET /api/dino/:id */
dinoRouter.route("/:id").get(controller.get);
