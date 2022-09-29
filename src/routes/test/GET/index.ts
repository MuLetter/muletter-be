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

export default routes;
