export * from "./auth/types";
export * from "./mailbox/types";
export * from "./spotify/types";
export * from "./mail/types";

export interface Projection {
  [key: string]: number | string;
}

export interface AdminOptions {
  dbDrop?: boolean;
}
