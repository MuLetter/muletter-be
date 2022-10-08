import { MailBoxModel, SeedZoneModel } from "@models";
import { ClusterZone } from "@models/types";
import _ from "lodash";
import { getCoord, getCountPercentage } from "./utils";

export class CoordGenerator {
  static async getCoord(mailBoxId: string) {
    const mailBox = await MailBoxModel.findById(mailBoxId);
    const clusterZone = await ClusterZone.recovery();

    const K = clusterZone.kmeans.K;
    const trackIds = _.map(mailBox!.tracks, ({ id }) => id);
    const seedCheck = await SeedZoneModel.find(
      {
        id: { $in: trackIds },
      },
      {
        _id: 0,
        id: 1,
        label: 1,
      }
    );
    const labelCounts = _.countBy(seedCheck, ({ label }) => label);
    const countPercentages = getCountPercentage(K, labelCounts);
    // console.log(countPercentages);

    // console.log("getCoord", getCoord(countPercentages));
    const [x, y] = getCoord(countPercentages);

    await MailBoxModel.updateOne(
      { _id: mailBoxId },
      {
        $set: {
          point: {
            x,
            y,
          },
        },
      }
    );
  }

  static async allMakeCoord() {
    const mailBoxes = await MailBoxModel.find({});

    for (let mailBox of mailBoxes) await CoordGenerator.getCoord(mailBox.id);
  }
}
