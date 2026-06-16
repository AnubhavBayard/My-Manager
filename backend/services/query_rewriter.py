from ollama import chat

MODEL_NAME = "qwen3:8b"

def generate_queries(query):

    prompt = f"""
Generate 4 different search queries that could help
retrieve relevant documents for the question below.

Question:
{query}

Return exactly 4 search queries.

Format:

QUERY:
...

QUERY:
...

QUERY:
...
"""

    response = chat(
        model=MODEL_NAME,
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    queries = response["message"]["content"]

    return [
        q.strip()
        for q in queries.split("\n")
        if q.strip()
    ]