import { io } from "socket.io-client";

const socket = io("https://chatbot-1-f96n.onrender.com"); // Backend URL

export default socket;
