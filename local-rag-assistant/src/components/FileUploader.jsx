import { useState } from "react";
import { uploadFiles } from "../services/api"

export default function FileUploader({ setFiles }) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function handleChange(event) {
    const selectedFiles = Array.from(event.target.files);

    if (!selectedFiles.length) return;

    setFiles(selectedFiles);
    setUploading(true);

    // console.log("Uploading:", files);

    const result = await uploadFiles(selectedFiles);

    console.log(result);

    setUploading(false);
  }

  function handleDragOver(e) {
    e.preventDefault();
    setDragging(true);
  }

  function handleDragLeave() {
    setDragging(false);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragging(false);
    // Trigger the same logic as handleChange
    const dt = e.dataTransfer;
    if (dt.files.length) {
      handleChange({ target: { files: dt.files } });
    }
  }

  return (
    <div
      className={`upload-zone ${dragging ? "dragging" : ""}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        id="file-upload-input"
        type="file"
        multiple
        onChange={handleChange}
      />
      <div className="upload-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
          <polyline points="17 8 12 3 7 8"/>
          <line x1="12" y1="3" x2="12" y2="15"/>
        </svg>
      </div>
      <p className="upload-title">
        {uploading ? "Uploading…" : "Drop files here"}
      </p>
      <p className="upload-subtitle">
        {uploading ? "Processing your documents" : "PDF, DOCX, TXT supported"}
      </p>
      {uploading && (
        <div className="upload-progress">
          <div className="upload-progress-bar" />
        </div>
      )}
    </div>
  );
}