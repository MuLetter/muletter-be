import { MailBoxModel } from "@models";

import Express from "express";
import { TestUtils } from "./utils";

const routes = Express.Router();

routes.get("/", (req: Express.Request, res: Express.Response) => {
  const { data } = req.query;
  TestUtils(data as string);
  return res.send("settimeout 등록 완료.");
});

routes.post("/confirm", (req: Express.Request, res: Express.Response) => {
  console.log("정상적으로 도착함");

  console.log("당신이 보낸 데이터가 이것이 맞는감,,?", req.body.data);
  return res.send("settimeout 등록 완료.");
});

routes.get(
  "/error",
  async (
    req: Express.Request,
    res: Express.Response,
    next: Express.NextFunction
  ) => {
    try {
      // const mailBox = await MailBoxModel.findOne({ zz: 1 });
      const mailBox = undefined;

      (mailBox as any).id = 0;

      return mailBox;
    } catch (err) {
      return next(err);
    }
  }
);

export default routes;
