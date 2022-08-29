export * from "./auth/types";
export * from "./mailbox/types";
export * from "./spotify/types";

export interface Projection {
  [key: string]: number;
}

export interface AdminOptions {
  dbDrop?: boolean;
}
