import { io } from "socket.io-client";

const socket = io("https://chatbot-1-f96n.onrender.com/", {
  transports: ["websocket"],
});

socket.on("connect", () => {
  console.log("Connected to server:", socket.id);
});

export default socket;
