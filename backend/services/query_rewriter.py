from groq import Groq
import config

client = Groq(
    api_key=config.GROQ_API_KEY
)

MODEL_NAME = "llama-3.1-8b-instant"

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

    response = client.chat.completions.create(
        model=MODEL_NAME,
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    queries = response.choices[0].message.content

    return [
        q.strip()
        for q in queries.split("\n")
        if q.strip()
    ]