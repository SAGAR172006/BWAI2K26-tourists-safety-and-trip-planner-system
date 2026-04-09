"""Tag engine — generates hashtag labels for itinerary activities."""

_CATEGORY_TAGS: dict[str, list[str]] = {
    "food": ["#foodie", "#localcuisine", "#musteat"],
    "stay": ["#accommodation", "#comfort", "#home"],
    "entertainment": ["#nightlife", "#fun", "#entertainment"],
    "cultural": ["#culture", "#history", "#heritage"],
    "art": ["#art", "#museum", "#creative"],
    "shopping": ["#shopping", "#souvenir", "#retail"],
    "nature": ["#nature", "#outdoors", "#scenery"],
    "transport": ["#transit", "#travel", "#commute"],
    "other": ["#experience", "#adventure"],
}

_KEYWORD_TAGS: dict[str, str] = {
    "museum": "#museum", "beach": "#beach", "temple": "#spiritual",
    "market": "#market", "park": "#park", "restaurant": "#dining",
    "cafe": "#cafe", "bar": "#bar", "hotel": "#hotel",
    "monument": "#landmark", "palace": "#heritage", "gallery": "#art",
    "tour": "#guided", "hike": "#hiking", "trek": "#trekking",
    "spa": "#wellness", "pool": "#resort", "cruise": "#cruise",
}


def generate_tags(activity_name: str, category: str, description: str = "") -> list[str]:
    tags: set[str] = set()
    base_tags = _CATEGORY_TAGS.get(category.lower(), _CATEGORY_TAGS["other"])
    tags.update(base_tags[:2])
    combined = (activity_name + " " + description).lower()
    for keyword, tag in _KEYWORD_TAGS.items():
        if keyword in combined:
            tags.add(tag)
            if len(tags) >= 4:
                break
    return list(tags)[:4]
