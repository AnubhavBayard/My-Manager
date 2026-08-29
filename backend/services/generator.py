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


def _chat_with_fallback(messages, *, temperature=None):
    last_error = None

    for model_name in MODEL_CANDIDATES:
        try:
            request_kwargs = {
                "model": model_name,
                "messages": messages,
            }
            if temperature is not None:
                request_kwargs["temperature"] = temperature
            return client.chat.completions.create(**request_kwargs)
        except Exception as exc:
            message = str(exc).lower()
            last_error = exc
            if "deprecated" not in message and "not found" not in message and "unknown model" not in message:
                raise

    if last_error is not None:
        raise last_error

    raise RuntimeError("No compatible Groq model is available for answer generation")


def generate_answer(
    question,
    chunks
):

    context = "\n\n".join(
        chunk["text"]
        for chunk in chunks
    )

    prompt = f"""
    You are a helpful document assistant.

    Use ONLY the provided context.

    Format your answers in clean Markdown:

    - Use headings when appropriate
    - Use bullet points
    - Use numbered lists
    - Keep answers easy to read
    - Never write everything in one paragraph

    If the answer is not contained in the context,
    say so and do not hallucinate.

    Context:
    {context}

    Question:
    {question}
    """

    response = _chat_with_fallback(
        [
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.2
    )

    return response.choices[0].message.content