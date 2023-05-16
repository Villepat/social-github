import React, { useState } from "react";
import "../styles/ChatModal.css";

function ChatModal({ user, onClose }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const handleInputChange = (event) => {
    setMessage(event.target.value);
  };

  const handleSendMessage = () => {
    // Here you would send the message over the WebSocket connection
    // For now, we just add it to the messages array
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: message, from: "me" },
    ]);
    setMessage("");
  };

  return (
    <div className="chat-modal">
      <h2>Chat with {user.fullname}</h2>
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div key={index} className={`chat-message ${message.from}`}>
            {message.text}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input type="text" value={message} onChange={handleInputChange} />
        <button onClick={handleSendMessage}>Send</button>
      </div>
      <button onClick={onClose}>Close</button>
    </div>
  );
}

export default ChatModal;
