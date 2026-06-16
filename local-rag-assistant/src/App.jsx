import { useState, useRef } from "react";
import FileUploader from "./components/FileUploader";
import FileList from "./components/FileList";
import ChatWindow from "./components/ChatWindow";
import "./index.css";

export default function App() {
  const [files, setFiles] = useState([]);

  return (
    <div className="app-layout">
      {/* ── Sidebar ── */}
      <aside className="sidebar">
        {/* Brand */}
        <div className="sidebar-brand">
          <div className="brand-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
          </div>
          <div className="brand-text">
            <h1>DocMind</h1>
            <span>Local RAG Assistant</span>
          </div>
        </div>

        {/* Upload Zone */}
        <div className="sidebar-section">
          <div className="sidebar-section-label">Upload Documents</div>
          <FileUploader setFiles={setFiles} />
        </div>

        {/* File List */}
        <div className="file-list-container">
          <div className="sidebar-section-label">Knowledge Base</div>
          <FileList files={files} />
        </div>

        {/* Footer */}
        <div className="sidebar-footer">
          <div className="status-dot" />
          <span className="status-text">Running locally · Private &amp; secure</span>
        </div>
      </aside>

      {/* ── Main Chat ── */}
      <main className="chat-main">
        <ChatWindow fileCount={files.length} />
      </main>
    </div>
  );
}