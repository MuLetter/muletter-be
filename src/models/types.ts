export * from "./auth/types";
export * from "./mailbox/types";
export * from "./spotify/types";
export * from "./mail/types";
export * from "./seedzone/types";
export * from "./clusterzone/types";

export interface Projection {
  [key: string]: number | string;
}

export interface AdminOptions {
  dbDrop?: boolean;
}
