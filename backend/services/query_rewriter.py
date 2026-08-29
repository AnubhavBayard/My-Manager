from groq import Groq
import config

client = Groq(
    api_key=config.GROQ_API_KEY
)

MODEL_CANDIDATES = [
    candidate
    for candidate in [
        config.GROQ_MODEL,
        "llama-3.3-70b-versatile",
        "llama-3.1-8b-instant",
        "llama-3.1-70b-versatile",
        "meta-llama/llama-4-scout-17b-16e-instruct",
    ]
    if candidate
]


def _chat_with_fallback(messages):
    last_error = None

    for model_name in MODEL_CANDIDATES:
        try:
            return client.chat.completions.create(
                model=model_name,
                messages=messages,
            )
        except Exception as exc:
            message = str(exc).lower()
            last_error = exc
            if "deprecated" not in message and "not found" not in message and "unknown model" not in message:
                raise

    if last_error is not None:
        raise last_error

    raise RuntimeError("No compatible Groq model is available for query rewriting")


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

    response = _chat_with_fallback([
        {
            "role": "user",
            "content": prompt
        }
    ])

    queries = response.choices[0].message.content

    return [
        q.strip()
        for q in queries.split("\n")
        if q.strip()
    ]