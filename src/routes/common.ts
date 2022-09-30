import { setRoutes } from "@utils";
import Express from "express";

export const METHODS = ["GET", "POST", "PATCH", "PUT", "DELETE"];

export class Routes {
  routes: Express.Router;

  constructor(dir: string, mw?: Array<any>) {
    this.routes = Express.Router();
    if (mw) for (let m of mw) this.routes.use(m);
    setRoutes.call(this, dir);
  }
}

export interface ReqIdParams {
  [key: string]: string;
  id: string;
}
