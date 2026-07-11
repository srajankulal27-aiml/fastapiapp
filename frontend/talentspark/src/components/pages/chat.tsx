import { useState, useEffect, useRef } from "react";
import api from "../../Services/api";
import { BsFillSendFill, BsRobot } from "react-icons/bs";
import { FaUserCircle } from "react-icons/fa";
import MarkdownRenderer from "../MarkdownRenderer";
import "./chat.css";

interface Message {
  sender: "bot" | "user";
  text: string;
}

export default function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "👋 Hello! I am your RecruitIQ Career Assistant. Ask me anything about job search, resume formatting, career progression, or recruitment tips!",
    },
  ]);
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const sendMessage = async () => {
    if (message.trim() === "" || loading) return;

    const currentMessage = message;
    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text: currentMessage,
      },
    ]);
    setMessage("");
    setLoading(true);

    try {
      const res = await api.post("/chat/ask_career", {
        message: currentMessage,
        session_id: "user_session_recruitiq",
      });

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
          text: "❌ Unable to connect to the server. Please ensure the backend server is running.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-page-container">
      <div className="page-header">
        <h1>AI Career Assistant</h1>
        <p>Chat with our AI Career Coach to get hiring suggestions, interview prep tips, and feedback on job criteria.</p>
      </div>

      <div className="full-chat-window card">
        <div className="full-chat-header">
          <div className="bot-info">
            <BsRobot className="bot-avatar-icon" />
            <div>
              <h3>RecruitIQ Career Coach</h3>
              <span className="online-indicator">
                <span className="status-dot green"></span> Active Now
              </span>
            </div>
          </div>
        </div>

        <div className="full-chat-body">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message-bubble-wrapper ${
                msg.sender === "user" ? "user-wrapper" : "bot-wrapper"
              }`}
            >
              <div className="avatar">
                {msg.sender === "user" ? (
                  <FaUserCircle className="avatar-icon user-avatar" />
                ) : (
                  <BsRobot className="avatar-icon bot-avatar" />
                )}
              </div>
              <div className="message-content">
                <div className="message-sender-name">
                  {msg.sender === "user" ? "Recruiter / Candidate" : "AI Assistant"}
                </div>
                <div className="message-bubble">
                  {msg.sender === "bot" ? (
                    <MarkdownRenderer content={msg.text} />
                  ) : (
                    msg.text
                  )}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="message-bubble-wrapper bot-wrapper">
              <div className="avatar animate-pulse">
                <BsRobot className="avatar-icon bot-avatar" />
              </div>
              <div className="message-content">
                <div className="message-sender-name">AI Assistant</div>
                <div className="message-bubble typing-bubble">
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef}></div>
        </div>

        <div className="full-chat-footer">
          <input
            type="text"
            placeholder="Ask a question (e.g., 'What skills should a React developer have?')..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
            disabled={loading}
          />
          <button className="send-btn" onClick={sendMessage} disabled={loading || !message.trim()}>
            <BsFillSendFill /> Send
          </button>
        </div>
      </div>
    </div>
  );
}