const axios = require("axios");

const GOOGLE_API_KEY = "AIzaSyDsp4_LOHUXxn-eXvc_VZnoonFvsqCTuwE"; // Replace with your API Key
const SEARCH_ENGINE_ID = "776a1c6e69c354dd2"; // Replace with your Search Engine ID

async function searchGoogle(query) {
  console.log("Searching Google for:", query); // ✅ Debugging log
  try {
    const response = await axios.get(
      `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&key=${GOOGLE_API_KEY}&cx=${SEARCH_ENGINE_ID}`
    );
    console.log("Google API Response:", response.data); // ✅ Debugging log

    if (response.data.items && response.data.items.length > 0) {
      // Return multiple results (first 3)
      return response.data.items.map((item) => ({
        title: item.title,
        snippet: item.snippet,
        link: item.link,
        image: item.pagemap?.cse_image?.[0]?.src || null, 
      }));
    } else {
      return [{ snippet: "No relevant results found.", link: "" }];
    }
  } catch (error) {
    console.error("Google Search API Error:", error);  // ✅ Log API errors
    return "Error fetching results.";
  }
}

module.exports = { searchGoogle };
