import http from "http";
import Express from "express";
import { Server } from "socket.io";
import connection from "./connection";
import { disconnect } from "process";

export function socketConnect(server: http.Server, app: Express.Application) {
  const io = new Server(server, {
    path: "/muletter.io",
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  app.set("io", io);
  io.on("connection", connection);
}
