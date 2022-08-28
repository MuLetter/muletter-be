import "module-alias/register";
import Express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import routes from "./routes";
import cors from "cors";
import { init } from "@models/connect";

dotenv.config();

class App {
  app: Express.Application;

  constructor() {
    this.app = Express();

    this.SetMW();
    this.SetRoutes();
  }

  SetMW() {
    this.app.use(cors());
    this.app.use(morgan("dev"));
    this.app.use(Express.json());
  }
  SetRoutes() {
    this.app.use(routes);
  }

  async Start() {
    const port = process.env.PORT ? parseInt(process.env.PORT) : 8000;

    this.app.listen(port, () => {
      console.log("[Express] Start! :)");
    });

    const dbDrop = process.env.DB_DROP ? process.env.DB_DROP === "true" : false;
    console.log(`[Mongoose Drop ?] ${dbDrop}`);

    await init({ dbDrop });
  }
}

export default new App().Start();
