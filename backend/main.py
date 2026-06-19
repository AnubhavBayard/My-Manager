import os
import config
from fastapi import FastAPI, UploadFile, File
from typing import List
from fastapi.middleware.cors import CORSMiddleware
from services.extractor import extract_text
from services.chunker import chunk_text
try:
    from services.embedder import (
        create_embeddings,
        store_embeddings,
        already_indexed
    )
except Exception as e:
    import traceback
    print("\n=== EMBEDDER ERROR ===")
    traceback.print_exc()
    print("======================\n")
    raise

from services.retriever import retrieve
from services.generator import generate_answer
from fastapi import Depends
from services.auth import get_current_user

app = FastAPI()

UPLOAD_DIR = "uploads"

os.makedirs(
    UPLOAD_DIR,
    exist_ok=True
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:8000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/me")
async def me(
    user=Depends(get_current_user)
):
    return {
        "id": user.id,
        "email": user.email
    }
    
@app.post("/upload")
async def upload_files(
    files: List[UploadFile] = File(...),
    user=Depends(get_current_user)
):

    results = []

    for file in files:

        file_path = os.path.join(
            UPLOAD_DIR,
            file.filename
        )

        with open(file_path, "wb") as f:

            content = await file.read()

            f.write(content)

        text = extract_text(file_path)

        if not text.strip():

            print(
                f"No text extracted from "
                f"{file.filename}"
            )

            continue

        chunks = chunk_text(text)

        if not chunks:

            print(
                f"No chunks generated for "
                f"{file.filename}"
            )

            continue

        embeddings = create_embeddings(
            chunks
        )

        store_embeddings(
            chunks,
            embeddings,
            file.filename,
            user.id
        )

        results.append({
            "filename": file.filename,
            "characters": len(text),
            "chunks": len(chunks)
        })

    return {
        "uploaded": results
    }


@app.get("/search")
def search(
    query: str,    
    user=Depends(get_current_user)
):

    return retrieve(query, user.id)


@app.get("/chat")
def chat(
    query: str,
    user=Depends(get_current_user)
):

    chunks = retrieve(query, user.id)

    answer = generate_answer(
        query,
        chunks
    )

    return {
        "answer": answer,
        "sources": list(
            set(
                chunk["source"]
                for chunk in chunks
            )
        )
    }