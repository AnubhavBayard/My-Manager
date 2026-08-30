from fastapi import Header, HTTPException
from supabase import create_client
import config

supabase_url = config.SUPABASE_URL or os.getenv("SUPABASE_URL")
supabase_key = config.SUPABASE_KEY or os.getenv("SUPABASE_ANON_KEY") or os.getenv("SUPABASE_KEY")

supabase = create_client(
    supabase_url,
    supabase_key
)

async def get_current_user(
    authorization: str = Header(None)
):

    if not authorization:
        raise HTTPException(
            status_code=401,
            detail="Missing token"
        )

    token = authorization.replace(
        "Bearer ",
        ""
    )

    try:
        user = supabase.auth.get_user(token)

        if not user.user:
            raise HTTPException(
                status_code=401,
                detail="Invalid token"
            )

        return user.user

    except Exception:
        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )