import { io } from "socket.io-client";

const socket = io("https://your-backend.onrender.com", {
  transports: ["websocket"],
});

socket.on("connect", () => {
  console.log("Connected to server:", socket.id);
});

export default socket;
