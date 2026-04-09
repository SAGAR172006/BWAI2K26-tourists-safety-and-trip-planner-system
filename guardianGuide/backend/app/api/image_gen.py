from fastapi import APIRouter, Depends, Query

from app.middleware.auth_guard import get_current_user
from app.middleware.rate_limiter import general_limiter_dep
from app.services.image_gen.unsplash_fetcher import fetch_destination_images

router = APIRouter(prefix="/images", tags=["images"])


@router.get("")
async def get_images(
    destination: str = Query(...),
    count: int = Query(default=3, ge=1, le=10),
    _user: dict = Depends(get_current_user),
    __: None = Depends(general_limiter_dep),
):
    urls = await fetch_destination_images(destination, count=count)
    return {"images": urls}
