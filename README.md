# Local RAG Assistant

![Python](https://img.shields.io/badge/Python-3.11-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-green)
![React](https://img.shields.io/badge/React-Frontend-blue)
![ChromaDB](https://img.shields.io/badge/VectorDB-ChromaDB-orange)
![Ollama](https://img.shields.io/badge/LLM-Qwen3%208B-purple)

## Screenshots

<table>
<tr>
<td align="center">
<b>Chat Interface</b><br>
<img src="screenshots/UI.png" width="100%">
</td>

<td align="center">
<b>Upload Documents</b><br>
<img src="screenshots/file-picker.png" width="100%">
</td>
</tr>
</table>

A local Retrieval-Augmented Generation (RAG) assistant that allows users to upload documents, index them into a vector database, and ask questions grounded in their own knowledge base.

The system supports PDFs, DOCX files, TXT files, and image-based documents using OCR.

---

## Features

### Document Ingestion

* PDF support
* DOCX support
* TXT support
* Image support (`.png`, `.jpg`, `.jpeg`, `.webp`)
* Automatic OCR fallback for scanned PDFs using PaddleOCR

### Retrieval Pipeline

* Recursive Character Text Splitting
* BGE Embeddings (`BAAI/bge-base-en-v1.5`)
* ChromaDB Vector Store
* Multi-Query Retrieval
* Cross-Encoder Re-ranking
* Source Attribution

### Generation

* Qwen 3 8B via Ollama
* Context-grounded responses
* Markdown-formatted answers
* Hallucination reduction through retrieval augmentation


### Frontend

* React
* Vite
* Modern chat interface
* File upload support

### Backend

* FastAPI
* REST API endpoints
* Automatic document synchronization
* Persistent vector database

---

![Retrieval Results](screenshots/working.png)

## Architecture

User Upload
↓
Text Extraction
↓
OCR (if required)
↓
Chunking
↓
Embeddings
↓
ChromaDB
↓
Multi-Query Retrieval
↓
Cross-Encoder Re-ranking
↓
Qwen 3 8B
↓
Final Answer

---

## Tech Stack

### Backend

* FastAPI
* ChromaDB
* Sentence Transformers
* PaddleOCR
* PyMuPDF
* LangChain Text Splitters
* Ollama

### Frontend

* React
* Vite
* Axios

### Models

#### Embedding Model

BAAI/bge-base-en-v1.5

#### Re-ranking Model

cross-encoder/ms-marco-MiniLM-L-6-v2

#### LLM

qwen3:8b

---

## Supported File Types

| Type | Supported |
| ---- | --------- |
| PDF  | ✅         |
| DOCX | ✅         |
| TXT  | ✅         |
| PNG  | ✅         |
| JPG  | ✅         |
| JPEG | ✅         |
| WEBP | ✅         |

---

## API Endpoints

### Upload Documents

POST /upload

Uploads one or more documents and indexes them into the vector database.

### Search

GET /search

Returns the most relevant chunks for a query.

### Chat

GET /chat

Generates a response using retrieved context.

---

## Installation

### Clone Repository

git clone https://github.com/AnubhavBayard/My-Manager.git

cd My-Manager

### Backend Setup

cd backend

python -m venv venv

venv\Scripts\activate

pip install -r requirements.txt

### Ollama

Install Ollama and pull Qwen:

ollama pull qwen3:8b

### Frontend

cd local-rag-assistant

npm install

npm run dev

### Run Backend

cd backend

uvicorn main:app --reload

---

## Future Improvements

* Hybrid Search (BM25 + Vector Search)
* Metadata Filtering
* Conversation Memory
* Parent Document Retrieval
* Query Expansion with LLM
* Citation Highlighting
* Streaming Responses
* Docker Deployment

---

## Author

Anubhav Bayard

Built as a fully local RAG assistant combining OCR, semantic search, reranking, and open-source LLMs.
