import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { supabase } from "../lib/supabase";

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

const SUGGESTIONS = [
  "Summarize the key points",
  "What are the main topics?",
  "Find important dates or numbers",
  "Explain this document to me",
];

// ── SVG Icons ───────────────────────────────────────────────
function SendIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13"/>
      <polygon points="22 2 15 22 11 13 2 9 22 2"/>
    </svg>
  );
}

function BotIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0110 0v4"/>
      <line x1="12" y1="3" x2="12" y2="7"/>
      <line x1="8" y1="15" x2="8" y2="15"/>
      <line x1="16" y1="15" x2="16" y2="15"/>
    </svg>
  );
}

function SourceIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
      <path d="M10 11v6"/>
      <path d="M14 11v6"/>
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  );
}

// ── Thinking Indicator ───────────────────────────────────────
function ThinkingIndicator() {
  return (
    <div className="thinking-wrapper">
      <div className="message-avatar bot-avatar">
        <BotIcon />
      </div>
      <div className="thinking-bubble">
        <div className="thinking-dots">
          <div className="thinking-dot" />
          <div className="thinking-dot" />
          <div className="thinking-dot" />
        </div>
        <span className="thinking-text">Thinking…</span>
      </div>
    </div>
  );
}

// ── Single Message ───────────────────────────────────────────
function MessageBubble({ message }) {
  const isUser = message.role === "user";

  return (
    <div className={`message-wrapper ${isUser ? "user" : "assistant"}`}>
      {/* Avatar */}
      <div className={`message-avatar ${isUser ? "user-avatar" : "bot-avatar"}`}>
        {isUser
          ? "U"
          : <BotIcon />
        }
      </div>

      {/* Content */}
      <div className="message-content">
        <div className="message-bubble">
          <ReactMarkdown>
            {message.content}
          </ReactMarkdown>
        </div>

        {/* Sources */}
        {message.sources?.length > 0 && (
          <div className="sources-block">
            <div className="sources-label">
              <SourceIcon />
              Sources
            </div>
            <div>
              {message.sources.map((source, idx) => (
                <span key={idx} className="source-tag">
                  <SourceIcon />
                  {source}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="message-time">{formatTime(message.time || new Date())}</div>
      </div>
    </div>
  );
}

// ── Empty State ──────────────────────────────────────────────
function EmptyState({ fileCount, onSuggestion }) {
  return (
    <div className="empty-state">
      <div className="empty-state-orb">
        <BotIcon />
      </div>
      <h2>
        {fileCount === 0
          ? "Upload docs to get started"
          : "Ask me anything"}
      </h2>
      <p>
        {fileCount === 0
          ? "Drop your PDFs or documents in the sidebar, then ask questions about them — everything runs privately on your machine."
          : `${fileCount} document${fileCount > 1 ? "s" : ""} ready. Start a conversation below.`}
      </p>
      {fileCount > 0 && (
        <div className="suggestion-chips">
          {SUGGESTIONS.map((s) => (
            <button key={s} className="chip" onClick={() => onSuggestion(s)}>
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main ChatWindow ──────────────────────────────────────────
export default function ChatWindow({ fileCount = 0 }) {
  const [messages, setMessages] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // ── Core send logic (unchanged) ──────────────────────────
  async function sendMessage(text) {
    const userQuery = text ?? query;
    if (!userQuery.trim()) return;

    setMessages((prev) => [
      ...prev,
      { role: "user", content: userQuery, time: new Date() },
    ]);

    setQuery("");
    setLoading(true);

    try {
      const {
        data: { session }
      } = await supabase.auth.getSession();

      if (!session) {
        throw new Error("No active session");
      }

      const response = await fetch(
        `http://127.0.0.1:8000/chat?query=${encodeURIComponent(userQuery)}`,
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`
          }
        }
      );

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.answer,
          sources: data.sources,
          time: new Date(),
        },
      ]);
    } catch (error) {
      console.error(error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Something went wrong. Make sure the backend is running at http://127.0.0.1:8000.",
          time: new Date(),
        },
      ]);
    }

    setLoading(false);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function clearChat() {
    setMessages([]);
  }

  return (
    <>
      {/* ── Header ── */}
      <div className="chat-header">
        <div className="chat-header-left">
          <div className="chat-header-avatar">
            <BotIcon />
          </div>
          <div className="chat-header-info">
            <h2>DocMind AI</h2>
            <p>
              {fileCount === 0
                ? "No documents loaded"
                : `${fileCount} document${fileCount > 1 ? "s" : ""} in context`}
            </p>
          </div>
        </div>
        <div className="chat-header-actions">
          {messages.length > 0 && (
            <button className="icon-btn" onClick={clearChat} title="Clear chat">
              <TrashIcon />
            </button>
          )}
          <button className="icon-btn" title="About">
            <InfoIcon />
          </button>
        </div>
      </div>

      {/* ── Messages ── */}
      <div className="messages-area">
        {messages.length === 0 ? (
          <EmptyState fileCount={fileCount} onSuggestion={(s) => sendMessage(s)} />
        ) : (
          messages.map((msg, i) => (
            <MessageBubble key={i} message={msg} />
          ))
        )}

        {loading && <ThinkingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* ── Input ── */}
      <div className="input-area">
        <div className="input-wrapper">
          <textarea
            ref={inputRef}
            id="chat-input"
            className="input-field"
            rows={1}
            value={query}
            placeholder="Ask about your documents…"
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            id="send-btn"
            className="send-btn"
            onClick={() => sendMessage()}
            disabled={!query.trim() || loading}
            title="Send message"
          >
            <SendIcon />
          </button>
        </div>
        <p className="input-hint">
          Press <kbd>Enter</kbd> to send · <kbd>Shift+Enter</kbd> for newline
        </p>
      </div>
    </>
  );
}