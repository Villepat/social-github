import React, { useState, useEffect } from "react";
import "../styles/ChatModal.css";
import { useAuth } from "../AuthContext";

function GroupChatModal({ group, onClose }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const { ws, nickname } = useAuth();

  useEffect(() => {
    if (ws) {
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("data: ", data);
        console.log(":DDD");
        console.log(group, data.receiver);
        if (data.receiver === group && data.command === "GROUP_MESSAGE")
          setMessages((prevMessages) => [
            ...prevMessages,
            { text: data.message, from: data.from },
          ]);
      };
    }

    return () => {
      if (ws) {
        ws.onmessage = null;
      }
    };
  }, [ws]);

  const handleInputChange = (event) => {
    setMessage(event.target.value);
  };

  const handleSendMessage = () => {
    console.log("sender: ", nickname);
    // Here you would send the message over the WebSocket connection
    if (ws.readyState === WebSocket.OPEN) {
      const payload = {
        receiver: group,
        sender: nickname,
        Command: "GROUP_MESSAGE",
        message,
      };

      // Send the message over the WebSocket connection
      ws.send(JSON.stringify(payload));
    }

    // For now, we just add it to the messages array
    // setMessages((prevMessages) => [
    //   ...prevMessages,
    //   { text: message, from: "me" },
    // ]);
    setMessage("");
  };

  return (
    <div className="chat-modal">
      <h2>Group Chat</h2>
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

export default GroupChatModal;
