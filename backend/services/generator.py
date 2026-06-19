from groq import Groq
import config

client = Groq(
    api_key=config.GROQ_API_KEY
)

MODEL_NAME = "llama-3.3-70b-versatile"

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

    response = client.chat.completions.create(
        model=MODEL_NAME,
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.2
    )

    return response.choices[0].message.content