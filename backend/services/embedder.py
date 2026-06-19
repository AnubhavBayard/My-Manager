from sentence_transformers import SentenceTransformer
import chromadb
from datetime import datetime

print("loading model...")

model = SentenceTransformer(
    "BAAI/bge-base-en-v1.5"
)
client = chromadb.PersistentClient(
    path="./chroma_db"
)
collection = client.get_or_create_collection(
    name="knowledge_base"
)

def already_indexed(filename):

    results = collection.get(
        where={
            "source": filename
        }
    )

    return len(results["ids"]) > 0

def create_embeddings(chunks):

    texts = [
        chunk["text"]
        for chunk in chunks
    ]

    embeddings = model.encode(
        texts,
        convert_to_numpy=True
    )

    return embeddings
  
def store_embeddings(
    chunks,
    embeddings,
    file_name,
    user_id
):

    collection.upsert(

        ids=[
            f"{file_name}_{c['chunk_id']}"
            for c in chunks
        ],

        documents=[
            c["text"]
            for c in chunks
        ],

        embeddings=embeddings.tolist(),

        metadatas=[
            {
                "user_id": user_id,
                "source": file_name,
                "chunk_id": c["chunk_id"],
                "chunk_size": c["chunk_size"],
                "word_count": c["word_count"],
                "file_type": file_name.split(".")[-1],
                "ingested_at": datetime.now().isoformat()
            }
            for c in chunks
        ]
    )