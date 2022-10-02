import { Track } from "@models/types";

export interface ReqMailLike {
  mailBoxId: string;
  track: Track;
}

export interface ReqMailDisLike {
  mailBoxId: string;
  trackId: string;
}
