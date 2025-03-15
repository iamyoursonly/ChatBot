const express = require("express");
const fs = require("fs");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const axios = require("axios");
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
// Corrected Google Apps Script Request
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwQmxBzI_tdsDnepwCuxxb7_NOjwxMkUmFJEPJYs_nZSJsb-nSWfDOwkv6FX5lqneTt/exec";

app.post("/save-name", async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: "Name is required" });

  try {
    const response = await axios.post(GOOGLE_SCRIPT_URL, { name });
    console.log("Google Script Response:", response.data); // Debugging log
    res.json({ message: "Name saved successfully" });
  } catch (error) {
    console.error("Error saving name:", error.response?.data || error.message);
    res.status(500).json({ message: "Error saving name" });
  }
});


const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
