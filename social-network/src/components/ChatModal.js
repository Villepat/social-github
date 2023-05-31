import React, { useState, useEffect } from "react";
import "../styles/ChatModal.css";
import { useAuth } from "../AuthContext";

function ChatModal({ user, onClose }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const { ws, nickname } = useAuth();


  useEffect(() => {
    if (ws) {
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: data.message, from: data.from, timestamp: new Date() },
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
    console.log("receiver: ", user.fullname);
    // Here you would send the message over the WebSocket connection
    if (ws.readyState === WebSocket.OPEN) {
      const payload = {
        receiver: user.fullname,
        sender: nickname,
        Command: "NEW_MESSAGE",
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

  //make sure the scroll position is the same as before
  useEffect(() => {
    const chatMessages = document.querySelector(".chat-messages");
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }, [messages]);
  

  const formatTimestamp = (dateTime) => {
    const options = {
      day: "numeric",
      month: "long",
      hour: "numeric",
      minute: "numeric",
    };
    return new Date(dateTime).toLocaleString(undefined, options);
  };


  return (
    <div className="chat-modal">
    <button className="close-x" onClick={onClose}>X</button>
    <h2>Chat with {user.fullname}</h2>
    <div className="chat-messages">
      {messages.map((message, index) => (
        <div key={index} className={`chat-message ${message.from}`}>
          <div className="chat-username">
            {message.from === "me" ? "Me" : user.fullname}
          </div>
          <div className="chat-message-text">
            {message.text}
          </div>
          <div className="chat-timestamp">
            {formatTimestamp(message.timestamp)}
          </div>
        </div>
      ))}
      </div>
      <div className="chat-input">
        <input className="text-input" type="text" value={message} onChange={handleInputChange} />
        <button className="send-button" onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
}

export default ChatModal;
