import { SeedZoneObserver } from "@lib";
import Express from "express";

const routes = Express.Router();

routes.post(
  "/seedzone",
  async (req: Express.Request, res: Express.Response) => {
    const seedZones = req.body;

    await SeedZoneObserver.append(seedZones);
    SeedZoneObserver.observing();

    res.send("okay");
  }
);

export default routes;
