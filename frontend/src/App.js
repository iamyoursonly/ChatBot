import { useEffect, useState } from "react";
import io from "socket.io-client";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Footer from "./footer"
const socket = io("https://chatbot-1-f96n.onrender.com");

function Chat() 
{
  const [userInput, setUserInput] = useState(""); 
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(true);

  useEffect(() => {
    setIsPopupOpen(true); // ✅ Always open popup on page load
  }, []);

  useEffect(() => {
    socket.on("connect", () => console.log("✅ Connected to server"));

    socket.on("response", (data) => {
      console.log("📩 Data received from backend:", data);
      setMessages((prev) => [...prev, ...data.map((item) => ({ ...item, sender: "bot" }))]);
    });

    return () => {
      socket.off("connect");
      socket.off("response");
    };
  }, []);

  const sendMessage = () => {
    if (message.trim() === "") return;
    setMessages((prev) => [...prev, { text: message, sender: "user" }]);
    socket.emit("message", message);
    setMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!userInput) {
      console.error("Error: Name field is empty!");
      return;
    }
    try {
      const response = await fetch("http://localhost:5000/save-name", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: userInput }),
      });
      if (!response.ok) {
        const errorMessage = await response.json();
        throw new Error(errorMessage.error || "Failed to save name");
      }
         console.log("Name saved successfully!");
         
          setIsPopupOpen(false);
    } catch (error) {
        console.error("Error:", error);
    }
};

    
  
 
  

  return (
    <div className={`chat-container ${darkMode ? "dark-mode" : "light-mode"}`}>
      {isPopupOpen && (
        <div className="popup-overlay" style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 9999
        }}>
          <div className="popup-box" style={{
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "10px",
            textAlign: "center"
          }}>
            <h2>Enter Your Name</h2>
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Your Name"
              style={{ padding: "10px", width: "80%", marginBottom: "10px" }}
            />
            <button onClick={handleSubmit} style={{ padding: "10px 20px", backgroundColor: "blue", color: "white", border: "none", cursor: "pointer" }}>Submit</button>
          </div>
        </div>
      )}
      <div className="chat-header">
        <h1 className="chat-title">💬 ASBOTS</h1>
        <button className="toggle-mode" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>
      <div className="chat-box resizable">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender === "user" ? "user-message" : "bot-message"}`}>
            {msg.title && <strong>{msg.title}</strong>}
            <p>{msg.snippet || msg.text}</p>
            {msg.link && (
              <a href={msg.link} target="_blank" rel="noopener noreferrer" className="chat-link">
                Read more 🔗
              </a>
            )}
            {msg.image && <img src={msg.image} alt="Result" className="result-image" />}
          </div>
        ))}
      </div>
      <div className="chat-input-box">
        <input
          type="text"
          className="chat-input"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className="chat-send-btn" onClick={sendMessage}>Send 🚀</button>
      </div>
      <Footer />
    </div>
  );
}

export default Chat;

