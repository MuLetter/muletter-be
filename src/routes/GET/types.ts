import { OAuthMemory } from "@models/types";

export const SPOTIFY_NEEDED_SCOPES = ["user-read-email", "streaming"];
export const SPOTIFY_OAUTH_QUERY_SET = {
  response_type: "code",
  client_id: process.env.SPOTIFY_CLIENT_ID,
  redirect_uri: process.env.SPOTIFY_OAUTH_REDIRECT_URI,
  scope: SPOTIFY_NEEDED_SCOPES.join(" "),
};
export interface ResGetSpotifyOAuth {
  url: string;
  memory: OAuthMemory;
}
