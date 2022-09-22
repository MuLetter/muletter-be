import dotenv from "dotenv";
dotenv.config();

export const SPOTIFY_TOKEN_BODY_SET = {
  redirect_uri: process.env.SPOTIFY_OAUTH_REDIRECT_URI,
  grant_type: "authorization_code",
};

export interface SpotifyToken {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: number;
  scope: string;
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
  href: null;
  total: number;
}

export interface Image {
  height: null;
  url: string;
  width: null;
}
