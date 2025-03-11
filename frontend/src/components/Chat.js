import { useEffect, useState } from "react";
import io from "socket.io-client";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap
import "../App.css"; // Import custom styles

const socket = io("http://localhost:5000");

function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]); // Store multiple messages

  useEffect(() => {
    socket.on("connect", () => console.log("✅ Connected to server"));

    socket.on("response", (data) => {
    console.log("📩 Data received from backend:", data); // Check if response is coming
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
    setMessage(""); // Clear input field
  };

  return (
    <div className="container mt-5 chat-container">
      <h1 className="text-center mb-4">💬 ASBOTS</h1>

      <div className="chat-box p-3">
      {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender === "user" ? "user-message" : "bot-message"}`}>
            {msg.title && <strong>{msg.title}</strong>}
            <p>{msg.snippet}</p>
            {msg.link && (
              <a href={msg.link} target="_blank" rel="noopener noreferrer" className="d-block">
                Read more 🔗
              </a>
            )}
            {msg.image && <img src={msg.image} alt="Result" className="result-image" />}
          </div>
        ))}
      </div>

      <div className="input-group mt-3">
        <input
          type="text"
          className="form-control"
          placeholder="Type a message.PUCHHO GURU"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className="btn btn-primary" onClick={sendMessage}>
          Send 🚀
        </button>
      </div>
    </div>
  );
}

export default Chat;
