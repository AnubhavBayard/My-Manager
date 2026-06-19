from services.embedder import model, collection
from services.query_rewriter import generate_queries
from services.reranker import rerank_chunks

def retrieve(query, user_id, n_results=15):

    queries = generate_queries(query) or []
    
    print(queries)
    
    queries.insert(0, query)
    
    queries = list(dict.fromkeys(queries))

    all_chunks = []

    for q in queries:

        query_embedding = model.encode(
            q
        ).tolist()

        results = collection.query(
            query_embeddings=[query_embedding],
            n_results=n_results,
            where={
                "user_id": user_id
            }
        )

        for doc, meta in zip(
            results["documents"][0],
            results["metadatas"][0]
        ):

            all_chunks.append({
                "text": doc,
                "source": meta["source"],
                "chunk_id": meta["chunk_id"],
                "chunk_size": meta["chunk_size"],
                "word_count": meta["word_count"],
                "file_type": meta["file_type"],
                "ingested_at": meta["ingested_at"]
            })

    seen = set()

    unique_chunks = []

    for chunk in all_chunks:

        key = (
            chunk["source"],
            chunk["chunk_id"]
        )

        if key not in seen:

            seen.add(key)

            unique_chunks.append(chunk)
        
    print(
        f"Retrieved {len(all_chunks)} chunks, "
        f"{len(unique_chunks)} after deduplication"
    )
    
    if not unique_chunks:
        return []

    reranked_chunks = rerank_chunks(
        query,
        unique_chunks,
        top_k=8
    )

    return reranked_chunks