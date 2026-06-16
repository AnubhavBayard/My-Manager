from ollama import chat

MODEL_NAME = "qwen3:8b"

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
        
        If you don't have the context then say so don't hallucinate.

        Context:
        {context}

        Question:
        {question}
    """

    response = chat(
        model=MODEL_NAME,
        messages=[
            {"role": "user", "content": prompt}
        ]
    )
    
    # print(prompt)

    return response["message"]["content"]