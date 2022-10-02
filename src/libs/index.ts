import RecommenderBuilder from "./Recommender/builder";

export async function RecommenderRun(id: string) {
  console.log("작업 시작합니다 :)");
  const builder = new RecommenderBuilder();
  const recommender = builder.get();

  try {
    await builder.step1(id);
    await builder.step2();
    console.log(recommender.spotifyToken);
    await builder.step3();
  } catch (err) {
    console.error(err);
  }

  for (let reco of recommender);
  console.log(recommender.recoTracks.length);
  console.log(recommender.recoTracks);

  const mail = await recommender.saveDB();
  console.log(mail);

  await recommender.isUseUpdate();
  await recommender.okay();
}
