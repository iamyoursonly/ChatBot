const express = require("express");
const fs = require("fs");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { searchGoogle } = require("./utils/openaiService"); // ✅ Correct import
const path = require("path"); // ✅ Add this line

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors({ origin: "*" })); 
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
// Path to the counter.txt file
const counterFile = path.join(__dirname, "counter.json");

// Ensure counter.txt exists
if (!fs.existsSync(counterFile)) {
    fs.writeFileSync(counterFile, "0");
}

app.get("/visitor-count", (req, res) => {
    console.log("Visitor count API hit"); // Debugging log

    try {
        let count = parseInt(fs.readFileSync(counterFile, "utf8")) || 0;
        count++;

        fs.writeFileSync(counterFile, count.toString());

        res.json({ count }); // ✅ Ensure response is JSON
    } catch (error) {
        console.error("Error reading/writing counter file:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
