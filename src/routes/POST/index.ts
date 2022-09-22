import { OAuthMemory } from "@models/types";
import Express from "express";
import { StatusCodes } from "http-status-codes";
import _ from "lodash";

const routes = Express.Router();

// Client-Side 백업데이터 저장용
routes.post(
  "/spotify-oauth/:state",
  async (req: Express.Request, res: Express.Response) => {
    const { state } = req.params;
    const oauthMemory = await OAuthMemory.get(state);
    await oauthMemory.save(req.body);

    return res.status(StatusCodes.OK).json({
      memory: _.toPlainObject(oauthMemory),
    });
  }
);

export default routes;
