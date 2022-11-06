import { MailBoxModel } from "@models";
import { MailBox } from "@models/types";
import { logger } from "@utils";
import RecommenderBuilder from "./Recommender/builder";

export * from "./SeedZoneObserver";
export async function RecommenderRun(id: string) {
  console.log("작업 시작합니다 :)");
  const builder = new RecommenderBuilder();
  const recommender = builder.get();

  try {
    await builder.step1(id);
    await builder.step2();
    console.log(recommender.spotifyToken);
    await builder.step3();

    for (let reco of recommender);
    console.log(recommender.recoTracks.length);
    console.log(recommender.recoTracks);

    const mail = await recommender.saveDB();
    console.log(mail);

    await recommender.isUseUpdate();
    await recommender.okay();
  } catch (err: any) {
    await MailBoxModel.updateOne(
      { _id: id },
      {
        $set: {
          status: "ERROR",
        },
      }
    );
    logger.error(err.message);
  }
}
