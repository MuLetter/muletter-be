import { Socket } from "socket.io";
import { disconnection } from "./disconnection";

export default function connection(socket: Socket) {
  console.log(`[ MuLetter Socket ] id - ${socket.id} socket connected`);
  const token = socket.request.headers.authorization;
  if (!token) {
    console.log(`[ MuLetter Socket ] we need token`);
    socket.disconnect();
    return;
  }

  socket.on("disconnect", () => disconnection(socket));
}
