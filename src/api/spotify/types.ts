import dotenv from "dotenv";
dotenv.config();

export type HasToken = {
  spotifyToken?: string;
};

export const SPOTIFY_TOKEN_BODY_SET = {
  redirect_uri: process.env.SPOTIFY_OAUTH_REDIRECT_URI,
  grant_type: "authorization_code",
};

export interface SpotifyToken {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: number;
  scope?: string;
}

export interface SpotifyUser {
  display_name: string;
  email: string;
  external_urls: ExternalUrls;
  followers: Followers;
  href: string;
  id: string;
  images: Image[];
  type: string;
  uri: string;
}

export interface ExternalUrls {
  spotify: string;
}

export interface Followers {
  href: any;
  total: number;
}

export interface Image {
  height: number;
  url: string;
  width: number;
}

export interface ResGetArtists {
  artists: Artist[];
}

export type ResAvailableGenres = {
  genres: string[];
};

export type ResAudioFeatures = {
  audio_features: AudioFeature[];
};

export type ResGetRecommendations = {
  tracks: Track[];
};

export interface AudioFeature {
  [key: string]: number | string;

  danceability: number;
  energy: number;
  key: number;
  loudness: number;
  mode: number;
  speechiness: number;
  acousticness: number;
  instrumentalness: number;
  liveness: number;
  valence: number;
  tempo: number;
  type: string;
  id: string;
  uri: string;
  track_href: string;
  analysis_url: string;
  duration_ms: number;
  time_signature: number;
}

export interface Track {
  album: Album;
  artists: Artist2[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_ids: ExternalIds;
  external_urls: ExternalUrls4;
  href: string;
  id: string;
  is_local: boolean;
  is_playable: boolean;
  name: string;
  popularity: number;
  preview_url: string;
  track_number: number;
  type: string;
  uri: string;
}

export interface Album {
  album_type: string;
  artists: Artist[];
  external_urls: ExternalUrls2;
  href: string;
  id: string;
  images: Image[];
  name: string;
  release_date: string;
  release_date_precision: string;
  total_tracks: number;
  type: string;
  uri: string;
}

export interface ExternalUrls {
  spotify: string;
}

export interface ExternalUrls2 {
  spotify: string;
}

export interface Artist2 {
  external_urls: ExternalUrls3;
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
}

export interface ExternalUrls3 {
  spotify: string;
}

export interface ExternalIds {
  isrc: string;
}

export interface ExternalUrls4 {
  spotify: string;
}

export interface Artist {
  external_urls: ExternalUrls;
  followers: Followers;
  genres: string[];
  href: string;
  id: string;
  images: Image[];
  name: string;
  popularity: number;
  type: string;
  uri: string;
}

export interface ExternalUrls {
  spotify: string;
}
