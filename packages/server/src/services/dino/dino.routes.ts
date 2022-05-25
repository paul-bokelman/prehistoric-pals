import express from "express";
import passport from "passport";
import * as controller from ".";

export const dinoRouter = express.Router();

dinoRouter.route("/generate").get(controller.generateDino);

dinoRouter.use(passport.authenticate("jwt", { session: true }));

dinoRouter.route("/:id").get(controller.getDino);
