import { Track } from "@models/types";

export interface ReqPostMailBoxBody {
  title: string;
}

export interface ReqPostTracksBody {
  tracks: Track[];
}
