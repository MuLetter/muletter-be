import "module-alias/register";
import Express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import routes from "./routes";
import cors from "cors";
import { init } from "@models/connect";
import { errorHandler } from "./routes/error";
import http from "http";
import https from "https";
import { socketConnect } from "./utils/socket";
import fs from "fs";

dotenv.config();

class App {
  server!: http.Server;
  app: Express.Application;

  constructor() {
    this.app = Express();

    this.SetMW();
    this.SetRoutes();
    if (process.env.TYPE === "SERVER") this.SetSSL();
    else this.server = http.createServer(this.app);
  }

  SetMW() {
    this.app.use(cors());
    this.app.use(morgan("dev"));
    this.app.use(Express.json());
    this.app.use("/static", Express.static("static"));
  }
  SetRoutes() {
    this.app.use(routes);
    this.app.use(errorHandler);
  }

  SetSSL() {
    const KEY_URL = process.env.KEY_URL;
    const options = {
      key: fs.readFileSync(`${KEY_URL}/privkey.pem`, "utf-8"),
      cert: fs.readFileSync(`${KEY_URL}/cert.pem`, "utf-8"),
      ca: fs.readFileSync(`${KEY_URL}/chain.pem`, "utf-8"),
    };

    this.server = https.createServer(options, this.app).listen(443, () => {
      console.log(`[Express : 443] Start! :)`);
    });
  }

  async Start() {
    const port = process.env.PORT ? parseInt(process.env.PORT) : 8000;

    this.server.listen(port, () => {
      console.log(`[Express : ${port}] Start! :)`);
    });

    const dbDrop = process.env.DB_DROP ? process.env.DB_DROP === "true" : false;
    console.log(`[Mongoose Drop ?] ${dbDrop}`);

    await init({ dbDrop });
    socketConnect(this.server, this.app);
  }
}

export default new App().Start();
