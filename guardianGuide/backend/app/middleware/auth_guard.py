"""Verify Supabase JWT and return the current user."""
from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.config import settings

security = HTTPBearer(auto_error=False)


async def get_current_user(
    creds: HTTPAuthorizationCredentials | None = Depends(security),
) -> dict:
    if creds is None or not creds.credentials:
        raise HTTPException(status_code=401, detail="Missing authorization")
    try:
        return await _verify_jwt(creds.credentials)
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=401, detail=f"Auth failed: {exc!s}") from exc


async def get_optional_user(
    creds: HTTPAuthorizationCredentials | None = Depends(security),
) -> dict | None:
    if creds is None or not creds.credentials:
        return None
    try:
        return await _verify_jwt(creds.credentials)
    except HTTPException:
        return None


async def _verify_jwt(token: str) -> dict:
    if not settings.supabase_url or not settings.supabase_service_key:
        raise HTTPException(status_code=503, detail="Auth not configured on server")
    from supabase import create_client

    client = create_client(settings.supabase_url, settings.supabase_service_key)
    res = client.auth.get_user(token)
    if res is None or res.user is None:
        raise HTTPException(status_code=401, detail="Invalid token")
    u = res.user
    return {"id": str(u.id), "email": getattr(u, "email", None) or ""}
