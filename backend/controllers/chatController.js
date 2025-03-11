const { searchGoogle } = require("../utils/openaiService");

const chatController = async (req, res) => {
  try {
    const userMessage = req.body.message;
    if (!userMessage) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Call Google Search API instead of OpenAI
    const response = await searchGoogle(userMessage);
    
    res.json({ reply: response });
  } catch (error) {
    console.error("Error in chatController:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports = { chatController };
