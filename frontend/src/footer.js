import React, { useEffect, useState } from "react";

const Footer = () => {
  const [visitorCount, setVisitorCount] = useState(0);
  const [hasFetched, setHasFetched] = useState(false); // Prevent double fetch

  useEffect(() => {
    if (!hasFetched) {
      fetch("https://chatbot-1-f96n.onrender.com") // Adjust to your backend URL in production
        .then((response) => response.json())
        .then((data) => setVisitorCount(data.count))
        .catch((error) => console.error("Error fetching visitor count:", error));
      
      setHasFetched(true);
    }
  }, [hasFetched]);

  return (
    <footer style={{ textAlign: "center", padding: "20px", background: "#333", color: "#fff" }}>
      <p>Visitors: {visitorCount}</p>
      <p>&copy; {new Date().getFullYear()} Your Website</p>
    </footer>
  );
};

export default Footer;
