from fastapi import APIRouter, Depends, File, UploadFile

from app.middleware.auth_guard import get_current_user
from app.middleware.rate_limiter import ai_limiter_dep
from app.models.translate_models import TranslateTextRequest
from app.services.translation.ocr_translator import translate_image
from app.services.translation.text_translator import translate_text

router = APIRouter(prefix="/translate", tags=["translate"])


@router.post("/text")
async def translate_text_route(
    body: TranslateTextRequest,
    _user: dict = Depends(get_current_user),
    _: None = Depends(ai_limiter_dep),
):
    return await translate_text(body.text, body.source_lang, body.target_lang)


@router.post("/image")
async def translate_image_route(
    file: UploadFile = File(...),
    target_lang: str = "en",
    _user: dict = Depends(get_current_user),
    _: None = Depends(ai_limiter_dep),
):
    data = await file.read()
    return await translate_image(data, target_lang=target_lang)
