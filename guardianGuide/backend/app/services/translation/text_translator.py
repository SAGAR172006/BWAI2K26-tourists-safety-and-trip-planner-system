"""Text translation via HuggingFace Helsinki-NLP models."""
import httpx
from app.config import settings
from app.models.translate_models import TranslateTextResponse

HF_BASE = "https://api-inference.huggingface.co/models/Helsinki-NLP"


def _headers() -> dict[str, str]:
    return {"Authorization": f"Bearer {settings.huggingface_api_key}"}


async def translate_text(text: str, source_lang: str, target_lang: str) -> TranslateTextResponse:
    if source_lang == "auto":
        source_lang = "en"

    model_id = f"opus-mt-{source_lang}-{target_lang}"
    url = f"{HF_BASE}/{model_id}"

    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            resp = await client.post(url, headers=_headers(), json={"inputs": text})
            resp.raise_for_status()
            data = resp.json()

            if isinstance(data, list) and data:
                translated = data[0].get("translation_text", text)
            else:
                translated = text

            return TranslateTextResponse(
                translated_text=translated,
                source_lang=source_lang,
                target_lang=target_lang,
            )
    except Exception as exc:
        print(f"[Translate] Error ({source_lang}->{target_lang}): {exc}")
        return TranslateTextResponse(
            translated_text=text,
            source_lang=source_lang,
            target_lang=target_lang,
        )
