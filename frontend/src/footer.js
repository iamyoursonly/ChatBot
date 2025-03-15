import React, { useEffect, useState } from "react";

const Footer = () => {
  const [visitorCount, setVisitorCount] = useState(0);

  useEffect(() => {
    fetch("https://chatbot-1-f96n.onrender.com/visitor-count")
      .then(response => {
        console.log("Response received:", response); // Debug log
        return response.json(); // Ensure JSON parsing
      })
      .then(data => {
        console.log("Visitor count:", data);
        setVisitorCount(data.count);
      })
      .catch(error => console.error("Error fetching visitor count:", error));
  }, []);

  return (
    <footer style={{ textAlign: "center", padding: "20px", background: "#333", color: "#fff" }}>
      <p>Visitors: {visitorCount}</p>
      <p>&copy; {new Date().getFullYear()} Your Website</p>
    </footer>
  );
};

export default Footer;
