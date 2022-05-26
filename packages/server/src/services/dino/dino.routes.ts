import express from "express";
import passport from "passport";
import * as controller from ".";
import { isAdmin } from "lib/passport";

export const dinoRouter = express.Router();

dinoRouter.route("/generate").get(controller.generateDino);

dinoRouter.use(passport.authenticate("jwt", { session: true }));

dinoRouter.route("/:id").get(controller.getDino);

dinoRouter.delete("/delete", isAdmin, controller.deleteDino);
