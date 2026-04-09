import asyncio

import httpx

from app.config import settings

HF_API_URL = (
    "https://api-inference.huggingface.co/models/"
    "cardiffnlp/twitter-roberta-base-sentiment-latest"
)

LABEL_TO_SCORE = {
    "POSITIVE": 5.0,
    "LABEL_2": 5.0,
    "NEUTRAL": 3.0,
    "LABEL_1": 3.0,
    "NEGATIVE": 1.0,
    "LABEL_0": 1.0,
}


async def analyze_sentiment(texts: list[str]) -> list[dict]:
    if not texts or not settings.huggingface_api_key:
        return [{"label": "NEUTRAL", "score": 0.5} for _ in texts]

    headers = {"Authorization": f"Bearer {settings.huggingface_api_key}"}
    results: list[dict] = []
    batch_size = 8

    async with httpx.AsyncClient(timeout=45.0) as client:
        for i in range(0, len(texts), batch_size):
            batch = [t.replace("\n", " ")[:512] for t in texts[i : i + batch_size]]
            for attempt in range(2):
                try:
                    resp = await client.post(
                        HF_API_URL, headers=headers, json={"inputs": batch}
                    )
                    if resp.status_code == 503:
                        await asyncio.sleep(8)
                        continue
                    resp.raise_for_status()
                    batch_results = resp.json()
                    for item_results in batch_results:
                        if isinstance(item_results, list):
                            best = max(item_results, key=lambda x: x.get("score", 0))
                            results.append(
                                {
                                    "label": best.get("label", "NEUTRAL").upper(),
                                    "score": best.get("score", 0.5),
                                }
                            )
                        else:
                            results.append({"label": "NEUTRAL", "score": 0.5})
                    break
                except Exception as exc:
                    print(f"[HF] sentiment batch error: {exc}")
                    if attempt == 1:
                        results.extend(
                            [{"label": "NEUTRAL", "score": 0.5} for _ in batch]
                        )
            if i + batch_size < len(texts):
                await asyncio.sleep(0.4)

    while len(results) < len(texts):
        results.append({"label": "NEUTRAL", "score": 0.5})
    return results[: len(texts)]


def map_sentiment_to_score(sentiment: dict) -> float:
    label = sentiment.get("label", "NEUTRAL").upper()
    confidence = float(sentiment.get("score", 0.5))
    base = LABEL_TO_SCORE.get(label, 3.0)
    return round(base * confidence + 3.0 * (1 - confidence), 2)
