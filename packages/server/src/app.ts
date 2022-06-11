import dotenv from "dotenv";
import express, { Express } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import passport from "passport";
import { env, preflightENV } from "lib/env";
import { services } from "services";

dotenv.config({
  path: ".env.development",
});

preflightENV(); // This is a preflight check to ensure that the .env file is properly configured.

require("./lib/passport");

const app: Express = express();

app.use(bodyParser.json());
app.use(cors({ origin: env("CLIENT_URL"), credentials: true })); // origin should be in env
app.use(passport.initialize());

app.use("/api", services);

const port = env("PORT") || 8000;

app.listen(port, () => console.log(`running this bitch on localhost:${port}`));
