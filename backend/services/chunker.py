def chunk_text(text):

    chunk_size = 800
    overlap = 150

    results = []

    start = 0
    chunk_id = 0

    while start < len(text):

        end = start + chunk_size

        chunk = text[start:end]

        results.append({
            "chunk_id": chunk_id,
            "text": chunk,
            "chunk_size": len(chunk),
            "word_count": len(chunk.split())
        })

        chunk_id += 1
        start += chunk_size - overlap

    return results