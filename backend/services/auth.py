from fastapi import Header, HTTPException
from supabase import create_client
import os

supabase = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_ANON_KEY")
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