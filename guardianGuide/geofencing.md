— Zone System & Leaflet Implementation

## Zone Definitions

| Zone | Color | Score Range | Meaning |
|---|---|---|---|
| GREEN | #22c55e | S > 3.0 | Safe, recommended for tourists |
| WHITE | #e2e8f0 | 2.0 ≤ S ≤ 3.0 | Neutral, proceed with awareness |
| RED | #ef4444 | S < 2.0 | Avoid, high risk reported |

## Leaflet GeoJSON Component

```typescript
// components/home/active/SafetyMiniMap.tsx

import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet'

const ZONE_COLORS = {
  GREEN: { fill: '#22c55e', opacity: 0.35 },
  WHITE: { fill: '#e2e8f0', opacity: 0.20 },
  RED:   { fill: '#ef4444', opacity: 0.35 },
}

function getZoneStyle(feature: GeoJSON.Feature) {
  const zone = feature.properties?.zone as 'GREEN' | 'WHITE' | 'RED'
  const colors = ZONE_COLORS[zone] ?? ZONE_COLORS.WHITE
  return {
    fillColor: colors.fill,
    fillOpacity: colors.opacity,
    color: colors.fill,
    weight: 1,
    opacity: 0.7,
  }
}

function onEachZone(feature: GeoJSON.Feature, layer: L.Layer) {
  if (feature.properties) {
    layer.bindPopup(
      `<b>${feature.properties.neighborhood}</b><br/>
       Safety Score: ${feature.properties.score}<br/>
       Status: ${feature.properties.zone}`
    )
  }
}

export function SafetyMiniMap({ lat, lng, zones }: Props) {
  return (
    <MapContainer
      center={[lat, lng]}
      zoom={13}
      style={{ height: '100%', width: '100%', borderRadius: '12px' }}
      zoomControl={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='© OpenStreetMap'
      />
      <GeoJSON
        data={zones}
        style={getZoneStyle}
        onEachFeature={onEachZone}
      />
    </MapContainer>
  )
}
```

## Map Update Logic
- Map data fetched on: trip activation, every 10 minutes (setInterval), and on location change > 500m
- User location marker: blue pulsing dot, updates in real-time
- Red zone proximity alert: if user moves within 300m of RED zone → push notification trigger

---