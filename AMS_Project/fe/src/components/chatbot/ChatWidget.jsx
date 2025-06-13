import React, { useState, useEffect, useRef } from "react";

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSend = async () => {
    if (input.trim()) {
      const userMessageText = input.trim();
      setMessages((prev) => [...prev, { text: userMessageText, sender: "user" }]);
      setInput("");
      const chatHistoryForGemini = messages.map(msg => {
        if (msg.sender === "user") {
          return { role: "user", parts: [{ text: msg.text }] };
        } else if (msg.sender === "bot") {
          return { role: "model", parts: [{ text: msg.text }] };
        }
        return null;
      }).filter(Boolean);
      chatHistoryForGemini.push({ role: "user", parts: [{ text: userMessageText }] });

      try {
        const response = await fetch("http://localhost:8080/chat/all", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ chatHistory: chatHistoryForGemini }),
        });

        const data = await response.json();
        const botReply = data.reply || "Xin lỗi, tôi không thể trả lời lúc này.";

        setMessages((prev) => [...prev, { text: botReply, sender: "bot" }]);
      } catch (error) {
        console.error("Error sending message:", error);
        setMessages((prev) => [
          ...prev,
          { text: "Lỗi kết nối đến máy chủ hoặc xử lý phản hồi!", sender: "bot" },
        ]);
      }
    }
  };

  return (
    <div className={`chat-widget ${isOpen ? "open" : ""}`}>
      <button className="chat-toggle-btn" onClick={toggleChat}>
        💬
      </button>
      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">Customer support</div>
          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender}`}>
                {msg.sender === "bot" ? (
                  <span dangerouslySetInnerHTML={{ __html: msg.text }} />
                ) : (
                  msg.text
                )}
              </div>
            ))}
            <div ref={messagesEndRef} /> {/* For auto-scrolling */}
          </div>
          <div className="chat-input">
            <input
              type="text"
              placeholder="Input message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button onClick={handleSend}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
