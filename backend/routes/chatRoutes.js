const express = require("express");
const router = express.Router();
const { chatController } = require("../controllers/chatController");

// Use chatController inside the route
//router.post("/chat", chatController);
router.post("/chat", async (req, res) => {
        const userMessage = req.body.message;
        const results = await searchGoogle(userMessage);
        res.json(results); // Send multiple results
      });
module.exports = router;
