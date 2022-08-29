import { Socket } from "socket.io";

export function disconnection(socket: Socket) {
  console.log(`[ MuLetter Socket ] id - ${socket.id} socket disconnected`);
}
