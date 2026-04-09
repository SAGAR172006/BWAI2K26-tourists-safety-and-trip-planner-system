from app.services.sentiment.score_calculator import calculate_zone_score


def test_zone_green_when_high_scores():
    r = calculate_zone_score(
        "x",
        "Test City",
        [4.0, 4.5],
        [{"label": "POSITIVE", "score": 0.9}],
    )
    assert r.zone == "GREEN"
    assert r.final_score > 3.0


def test_neutral_fallback():
    r = calculate_zone_score("x", "Y", [], [])
    assert r.final_score == 3.0
    assert r.zone == "WHITE"
