from dotenv import load_dotenv
import os

load_dotenv()


def _clean_env(name):
    value = os.getenv(name)
    if value is None:
        return None
    return value.strip().strip("\r")


SUPABASE_URL = _clean_env("SUPABASE_URL")
SUPABASE_KEY = _clean_env("SUPABASE_KEY")
GROQ_API_KEY = _clean_env("GROQ_API_KEY")
GROQ_MODEL = _clean_env("GROQ_MODEL")