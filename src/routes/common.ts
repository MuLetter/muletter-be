import { setRoutes } from "@utils";
import Express from "express";

export const METHODS = ["GET", "POST", "PATCH", "PUT", "DELETE"];

export class Routes {
  routes: Express.Router;

  constructor(dir: string) {
    this.routes = Express.Router();
    setRoutes.call(this, dir);
  }
}
