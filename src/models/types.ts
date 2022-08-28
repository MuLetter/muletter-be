export * from "./auth/types";

export interface Projection {
  [key: string]: number;
}

export interface AdminOptions {
  dbDrop?: boolean;
}
