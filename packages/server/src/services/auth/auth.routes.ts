import express from "express";
import * as controller from "./controller";

export const authRouter = express.Router();

authRouter.get("/:address/nonce", controller.getNonce);

authRouter.post(
  "/:address/signature",
  // passport.authenticate("jwt", { session: false }),
  controller.signNonce
);

// authRouter.route("/:user/logout").post(controller.logout); NEEDED
