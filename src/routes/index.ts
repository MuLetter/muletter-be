import Express from "express";

class Routes {
  routes: Express.Router;

  constructor() {
    this.routes = Express.Router();
  }
}

export default new Routes().routes;
