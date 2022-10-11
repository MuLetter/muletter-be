import { MailBoxModel } from "@models";
import Express from "express";
import { StatusCodes } from "http-status-codes";

const routes = Express.Router();

routes.get("/", async (req: Express.Request, res: Express.Response) => {
  const mailBoxes = await MailBoxModel.find({}, { image: 1, point: 1, _id: 1 });

  return res.status(StatusCodes.OK).json(mailBoxes);
});

export default routes;
