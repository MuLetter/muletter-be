import { Projection } from "../types";

export const authProjection: Projection = {
  __v: 0,
  createdAt: 0,
  updatedAt: 0,
};

export const authSimpleProjection: Projection = {
  _id: 0,
  username: 1,
  profile: 1,
  nickname: 1,
};
