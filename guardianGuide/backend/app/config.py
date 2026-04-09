"""Application settings loaded from environment."""
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    supabase_url: str = ""
    supabase_service_key: str = ""

    gmail_client_id: str = ""
    gmail_client_secret: str = ""
    gmail_redirect_uri: str = ""

    google_generative_ai_api_key: str = ""
    llm_model: str = "gemini-2.0-flash"
    llm_fallback_model: str = "gemini-1.5-flash"

    foursquare_api_key: str = ""
    unsplash_access_key: str = ""
    serper_api_key: str = ""
    huggingface_api_key: str = ""

    twilio_account_sid: str = ""
    twilio_auth_token: str = ""
    twilio_phone_number: str = ""

    resend_api_key: str = ""
    from_email: str = "onboarding@resend.dev"

    redis_url: str = "redis://localhost:6379/0"

    app_env: str = "development"
    allowed_origins: str = "http://localhost:3000"
    secret_key: str = "dev-secret-change-me"

    nominatim_user_agent: str = "GuardianGuide/1.0"


settings = Settings()
