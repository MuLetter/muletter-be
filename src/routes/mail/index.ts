import { loginCheck } from "@middlewares";
import { Routes } from "@routes/common";

export default new Routes(__dirname, [loginCheck]).routes;
