from sentence_transformers import CrossEncoder

reranker = CrossEncoder(
    "cross-encoder/ms-marco-MiniLM-L-6-v2"
)

def rerank_chunks(
    query,
    chunks,
    top_k=8
):

    pairs = [
        (
            query,
            chunk["text"]
        )
        for chunk in chunks
    ]

    scores = reranker.predict(pairs)

    scored_chunks = list(
        zip(chunks, scores)
    )

    scored_chunks.sort(
        key=lambda x: x[1],
        reverse=True
    )

    results = []

    for chunk, score in scored_chunks[:top_k]:

        chunk["rerank_score"] = float(score)

        print(
            f"{score:.4f}",
            chunk["source"],
            f"chunk={chunk['chunk_id']}"
        )

        results.append(chunk)

    return results