import { Auth } from "@models/types";
import Express from "express";
import { ReqJoinBody } from "./types";

const routes = Express.Router();

routes.post("/", async (req: Express.Request, res: Express.Response) => {
  return res.send("test");
});

routes.post(
  "/join",
  async (
    req: Express.Request<any, any, ReqJoinBody>,
    res: Express.Response
  ) => {
    const { username, password, nickname } = req.body;

    try {
      const auth = await Auth.get(username, password, nickname);
      console.log(await auth.save());
    } catch (err) {
      console.error(err);
    }

    return res.send("test");
  }
);

export default routes;
