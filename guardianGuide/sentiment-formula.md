— Sentiment Scoring Formula

## The Formula

```
S = (GoogleScore × 0.6) + (SocialScore × 0.4)

Where:
  GoogleScore  = average Google star rating (1–5 scale, no normalization needed)
  SocialScore  = HuggingFace sentiment mapped to 1–5 scale

HuggingFace label → score mapping:
  POSITIVE  → 5.0
  NEUTRAL   → 3.0
  NEGATIVE  → 1.0
  (intermediate confidence scores interpolated linearly)

Zone assignment:
  S > 3.0  → GREEN  (Safe)
  2.0 ≤ S ≤ 3.0 → WHITE (Neutral)
  S < 2.0  → RED   (Avoid)
```

## Implementation

```python
# services/sentiment/score_calculator.py

from dataclasses import dataclass

@dataclass
class SentimentResult:
    location_id: str
    google_score: float      # Raw 1–5 stars average
    social_score: float      # HuggingFace mapped 1–5
    final_score: float       # S = weighted average
    zone: str                # "GREEN" | "WHITE" | "RED"
    sample_size: int         # Number of reviews analyzed
    confidence: float        # 0–1, based on sample size

def calculate_zone_score(
    google_ratings: list[float],
    social_sentiments: list[dict]  # [{"label": "POSITIVE", "score": 0.94}]
) -> SentimentResult:
    
    # Step 1: Google score (simple average of star ratings)
    google_score = sum(google_ratings) / len(google_ratings) if google_ratings else 3.0
    
    # Step 2: Map HuggingFace outputs to 1–5 scale
    mapped_scores = []
    for sentiment in social_sentiments:
        label = sentiment["label"].upper()
        confidence = sentiment["score"]
        
        if label == "POSITIVE":
            base = 5.0
        elif label == "NEUTRAL":
            base = 3.0
        else:  # NEGATIVE
            base = 1.0
        
        # Weight by confidence (high confidence → closer to base value)
        mapped = base * confidence + 3.0 * (1 - confidence)
        mapped_scores.append(mapped)
    
    social_score = sum(mapped_scores) / len(mapped_scores) if mapped_scores else 3.0
    
    # Step 3: Weighted final score
    final_score = (google_score * 0.6) + (social_score * 0.4)
    
    # Step 4: Zone assignment
    if final_score > 3.0:
        zone = "GREEN"
    elif final_score >= 2.0:
        zone = "WHITE"
    else:
        zone = "RED"
    
    # Step 5: Confidence based on sample size
    total_samples = len(google_ratings) + len(social_sentiments)
    confidence = min(total_samples / 100, 1.0)  # 100+ samples = full confidence
    
    return SentimentResult(
        google_score=google_score,
        social_score=social_score,
        final_score=round(final_score, 2),
        zone=zone,
        sample_size=total_samples,
        confidence=confidence
    )
```

---