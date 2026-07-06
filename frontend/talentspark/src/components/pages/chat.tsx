import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { BsChatDotsFill } from "react-icons/bs";
import "./chat.css";

function Chat() {
  const [open, setOpen] = useState(false);

  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "👋 Hello! I'm TalentSpark Assistant. How can I help you today?",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const sendMessage = async () => {
    if (message.trim() === "") return;

    const currentMessage = message;

    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text: currentMessage,
      },
    ]);

    setMessage("");

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/chat/ask_career",
        {
          message: currentMessage,
          session_id: "user123",
        }
      );

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: res.data.response,
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "❌ Unable to connect to the server.",
        },
      ]);
    }
  };

  return (
    <>
      {open && (
        <div className="chat-window">
          <div className="chat-header">
            <span>🤖TalentSpark Assistant</span>

            <button onClick={() => setOpen(false)}>✖</button>
          </div>

          <div className="chat-body">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={
                  msg.sender === "user"
                    ? "user-message"
                    : "bot-message"
                }
              >
                {msg.text}
              </div>
            ))}

            <div ref={messagesEndRef}></div>
          </div>

          <div className="chat-footer">
            <input
              type="text"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
            />

            <button onClick={sendMessage}>
              Send
            </button>
          </div>
        </div>
      )}

      <div
        className="chatbot"
        onClick={() => setOpen(!open)}
      >
        <BsChatDotsFill />
      </div>
    </>
  );
}

export default Chat;