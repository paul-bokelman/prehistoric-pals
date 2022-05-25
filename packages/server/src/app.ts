import express, { Express } from "express";
import session, { SessionOptions, Store } from "express-session";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import passport from "passport";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import { prisma } from "config";

import { services } from "./services";
import cookieParser from "cookie-parser";
require("./lib/passport");

dotenv.config({
  path: ".env.development",
});

const app: Express = express();

app.use(bodyParser.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true })); // env
// app.use(cookieParser());

// if (app.get("env") === "production") {
//   app.set("trust proxy", 1); // trust first proxy
//   appSession.cookie.secure = true; // serve secure cookies
// }

app.use(passport.initialize());

app.use("/api", services);

const port = process.env.PORT || 8000;

app.listen(port, () =>
  console.log(`Express app listening on localhost:${port}`)
);
