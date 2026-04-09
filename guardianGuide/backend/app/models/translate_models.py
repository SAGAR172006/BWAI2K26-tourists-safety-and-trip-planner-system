from pydantic import BaseModel, Field


class TranslateTextRequest(BaseModel):
    text: str = Field(max_length=2000)
    source_lang: str = "auto"
    target_lang: str = "en"


class TranslateTextResponse(BaseModel):
    translated_text: str
    source_lang: str = "auto"
    target_lang: str = "en"


class TranslateImageResponse(BaseModel):
    original_text: str
    translated_text: str
    target_lang: str = "en"
