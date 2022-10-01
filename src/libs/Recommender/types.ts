import Recommender from ".";

export type Seed = {
  [key: string]: string | number;
  seed_tracks: string;
  seed_artists: string;
  seed_genres: string;
  target_danceability: number;
  target_energy: number;
  target_loudness: number;
  target_speechiness: number;
  target_acousticness: number;
  target_liveness: number;
  target_valence: number;
  target_tempo: number;
};

export type NeedAudioFeautres =
  | "id"
  | "danceability"
  | "energy"
  | "loudness"
  | "speechiness"
  | "acousticness"
  | "liveness"
  | "valence"
  | "tempo";

export type ProcessAudioFeatures = {
  [key: string]: string | number;

  id: string;
  danceability: number;
  energy: number;
  loudness: number;
  speechiness: number;
  acousticness: number;
  liveness: number;
  valence: number;
  tempo: number;
};

export type PartitionData = {
  data: string;
  groupNum: number;
};

export type ArtistAndGenres = {
  id: string;
  genres: string[];
};

export interface IRecommederAdjust extends Recommender {
  next: () => IteratorResult<number>;
}
