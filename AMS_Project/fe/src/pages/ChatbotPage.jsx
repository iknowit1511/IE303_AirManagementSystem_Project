import React, { useState, useEffect, useRef } from "react";

const ChatbotPage = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi! Could you let me know what you need help with?", sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const [chatHistory] = useState(["Conversation Summary Request ..."]);
  const messagesEndRef = useRef(null); 

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

const handleSend = async () => {
  if (input.trim()) {
    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const res = await fetch("http://localhost:8080/chat/all", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      const botMessage = { text: data.reply || "Xin lỗi, tôi không hiểu.", sender: "bot" };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      setMessages((prev) => [...prev, { text: "Lỗi hệ thống.", sender: "bot" }]);
    }
  }
};

  const handleNewConversation = () => {
    setMessages([{ id: Date.now(), text: "New conversation started!", sender: "bot" }]);
  };

  return (
    <div className="chatbot-page-wrapper">
      <div className="chatbot-page">
        <div className="chat-sidebar">
          <div className="sidebar-header">
            <span className="today-label">Today</span>
          </div>
          <div className="chat-history">
            {chatHistory.map((chat, index) => (
              <div key={index} className="chat-item">
                {chat}
              </div>
            ))}
          </div>
          <button className="new-conversation-btn" onClick={handleNewConversation}>
            New Conversation
          </button>
        </div>
        <div className="chat-panel">
          <div className="chat-messages">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`message ${msg.sender === "user" ? "user" : "bot"}`}
              >
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="chat-input">
            <input
              type="text"
              placeholder="Ask anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatbotPage;