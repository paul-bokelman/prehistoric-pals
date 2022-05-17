import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";

import { services } from "./services";

dotenv.config({
  path: ".env.development",
});

const app: Express = express();

app.use(bodyParser.json());
app.use(cors());

app.use("/api", services);

const port = process.env.PORT || 8000;

app.listen(port, () =>
  console.log(`Express app listening on localhost:${port}`)
);
