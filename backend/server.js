const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { searchGoogle } = require("./utils/openaiService"); // ✅ Correct import

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
    res.send("Backend is running smoothly!");
});
io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("message", async (message) => {
    console.log("User message received:", message);  // ✅ Debugging log

    const response = await searchGoogle(message);
    console.log("Google Search API Response:", response); // ✅ Debugging log

    socket.emit("response", response);
});


  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
