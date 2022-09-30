import { loginCheck } from "@middlewares";
import { Routes } from "../common";

export default new Routes(__dirname, [loginCheck]).routes;
