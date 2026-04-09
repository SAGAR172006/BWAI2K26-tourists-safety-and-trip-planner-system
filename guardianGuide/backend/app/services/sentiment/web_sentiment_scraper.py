import httpx

from app.config import settings


async def fetch_web_sentiment_data(destination: str) -> list[str]:
    texts: list[str] = []

    try:
        from duckduckgo_search import DDGS

        with DDGS() as ddgs:
            for query in (
                f"{destination} safe for tourists",
                f"{destination} travel safety",
            ):
                for r in list(ddgs.text(query, max_results=4)):
                    body = r.get("body", "")
                    if body and len(body) > 30:
                        texts.append(body[:300])
    except Exception as exc:
        print(f"[DDG] {exc}")

    if settings.serper_api_key:
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                resp = await client.post(
                    "https://google.serper.dev/search",
                    headers={
                        "X-API-KEY": settings.serper_api_key,
                        "Content-Type": "application/json",
                    },
                    json={"q": f"{destination} tourist safety review", "num": 8},
                )
                data = resp.json()
                for result in data.get("organic", []):
                    sn = result.get("snippet", "")
                    if sn:
                        texts.append(sn[:300])
        except Exception as exc:
            print(f"[Serper] {exc}")

    try:
        import wikipedia

        page = wikipedia.page(f"{destination}", auto_suggest=True)
        for para in page.content.split("\n"):
            if len(para) > 60 and any(
                k in para.lower()
                for k in ("safe", "crime", "tourist", "travel", "security")
            ):
                texts.append(para[:300])
                if len(texts) >= 24:
                    break
    except Exception as exc:
        print(f"[Wikipedia] {exc}")

    if not texts:
        texts.append(
            f"{destination} is a popular destination; check local guidance before travel."
        )
    return texts[:28]
