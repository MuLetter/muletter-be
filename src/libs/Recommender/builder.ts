import Recommender from ".";

class RecommenderBuilder {
  recommender: Recommender;

  constructor() {
    this.recommender = new Recommender();
  }

  // 2. mail box init
  async step1(id: string) {
    await this.recommender.addMailBox(id);
    await this.recommender.addAvailableGenres();
    console.log("step 2 okay.");
  }

  // 3. ArtistAndGenres and AudioFeatures, for User
  async step2() {
    await this.recommender.addArtistAndGenres();
    await this.recommender.addAudioFeatures();
    console.log("step 3 okay.");
  }

  // 4. set seed and recommend API Call
  async step3() {
    this.recommender.addSeeds();
    await this.recommender.addRecommendations();
    await this.recommender.addRecoAudioFeatures();
    console.log("step 4 okay.");
  }

  get(): Iterable<Recommender> & Recommender {
    return this.recommender as Iterable<Recommender> & Recommender;
  }
}

export default RecommenderBuilder;
