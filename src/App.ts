import "module-alias/register";
import Express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import routes from "./routes";

dotenv.config();

class App {
  app: Express.Application;

  constructor() {
    this.app = Express();

    this.SetMW();
    this.SetRoutes();
  }

  SetMW() {
    this.app.use(morgan("dev"));
  }
  SetRoutes() {
    this.app.use(routes);
  }

  Start() {
    const port = process.env.PORT ? parseInt(process.env.PORT) : 8000;

    this.app.listen(port, () => {
      console.log("[Express] Start! :)");
    });
  }
}

export default new App().Start();
