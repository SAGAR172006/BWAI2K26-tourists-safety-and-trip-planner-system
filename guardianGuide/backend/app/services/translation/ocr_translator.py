"""OCR + translation. Optional Pillow/pytesseract — degrades gracefully if missing."""
import io

from app.models.translate_models import TranslateImageResponse
from app.services.translation.text_translator import translate_text


async def translate_image(image_bytes: bytes, target_lang: str = "en") -> TranslateImageResponse:
    try:
        from PIL import Image
        import pytesseract
    except ImportError:
        return TranslateImageResponse(
            original_text="",
            translated_text="Image translation requires Pillow and pytesseract on the server.",
            target_lang=target_lang,
        )

    try:
        img = Image.open(io.BytesIO(image_bytes))
        original_text = pytesseract.image_to_string(img).strip()
    except Exception as exc:
        print(f"[OCR] Failed to extract text: {exc}")
        original_text = ""

    if not original_text:
        return TranslateImageResponse(
            original_text="",
            translated_text="No text detected in image.",
            target_lang=target_lang,
        )

    result = await translate_text(original_text, source_lang="auto", target_lang=target_lang)
    return TranslateImageResponse(
        original_text=original_text,
        translated_text=result.translated_text,
        target_lang=target_lang,
    )
