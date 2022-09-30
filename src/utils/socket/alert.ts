import Express from "express";
import { AlertForm } from "./types";

export function writeSuccessAlert(
  req: Express.Request,
  socketId: string,
  form: AlertForm
) {
  const io = req.app.get("io");

  io.to(socketId).emit("write-mail-success", form);
}
