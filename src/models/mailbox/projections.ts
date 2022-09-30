import { Projection } from "@models/types";

export const MailBoxesProjection: Projection = {
  _id: 1,
  title: 1,
  image: 1,
  "tracks.id": 1,
  "tracks.album.images": 1,
};
