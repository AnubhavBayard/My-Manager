function formatBytes(bytes) {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function FileIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
    </svg>
  );
}

export default function FileList({ files }) {
  if (!files.length) {
    return (
      <div className="file-list-empty">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>
        </svg>
        <span>No documents yet</span>
        <span style={{ fontSize: "10px", color: "var(--text-muted)" }}>Upload files to get started</span>
      </div>
    );
  }

  return (
    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
      {files.map((file, index) => (
        <li key={index} className="file-item">
          <div className="file-icon">
            <FileIcon />
          </div>
          <div className="file-info">
            <div className="file-name" title={file.name}>{file.name}</div>
            {file.size && (
              <div className="file-size">{formatBytes(file.size)}</div>
            )}
          </div>
          <div className="file-status" title="Indexed" />
        </li>
      ))}
    </ul>
  );
}