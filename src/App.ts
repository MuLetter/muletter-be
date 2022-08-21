import Express from "express";
import dotenv from "dotenv";
import morgan from "morgan";

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
  SetRoutes() {}

  Start() {
    const port = process.env.PORT ? parseInt(process.env.PORT) : 8000;

    this.app.listen(port, () => {
      console.log("[Express] Start! :)");
    });
  }
}

export default new App().Start();
