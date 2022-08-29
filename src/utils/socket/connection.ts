import { Auth } from "@models/types";
import { Socket } from "socket.io";
import { disconnection } from "./disconnection";

export default async function connection(socket: Socket) {
  console.log(`[ MuLetter Socket ] id - ${socket.id} socket connected`);
  const token = socket.request.headers.authorization;
  if (!token) {
    console.log(`[ MuLetter Socket ] we need token`);
    socket.disconnect();
    return;
  }

  const auth = await Auth.tokenCheck(token);
  console.log("[ MuLetter Socket ] Connected User");
  console.log(auth);

  const socketCheck = await auth.update({
    socketId: socket.id,
  });
  if (socketCheck) console.log(`socket db in. ${socketCheck.socketId}`);

  socket.on("disconnect", () => disconnection(socket));
}
