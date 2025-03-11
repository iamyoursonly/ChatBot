import { useEffect, useState } from "react";
import io from "socket.io-client";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

const socket = io("http://localhost:5000");

function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

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

  return (
    <div className={`chat-container ${darkMode ? "dark-mode" : "light-mode"}`}>
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
    </div>
  );
}

export default Chat;
