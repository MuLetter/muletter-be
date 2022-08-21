import Express from "express";

const routes = Express.Router();

routes.post("/", (req: Express.Request, res: Express.Response) => {
  return res.send("test");
});

export default routes;
