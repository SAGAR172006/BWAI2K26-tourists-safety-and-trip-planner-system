import { NextRequest, NextResponse } from "next/server";

const UA = "GuardianGuide/1.0 (student project; contact@local)";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim();
  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  try {
    const url = new URL("https://nominatim.openstreetmap.org/search");
    url.searchParams.set("q", q);
    url.searchParams.set("format", "json");
    url.searchParams.set("limit", "8");
    url.searchParams.set("addressdetails", "1");

    const res = await fetch(url.toString(), {
      headers: { "User-Agent": UA },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return NextResponse.json({ results: [], detail: "Upstream error" }, { status: 502 });
    }

    const raw = (await res.json()) as Array<{
      place_id: number;
      display_name: string;
      lat: string;
      lon: string;
      address?: Record<string, string>;
    }>;

    const results = raw.map((r) => {
      const addr = r.address ?? {};
      const city =
        addr.city || addr.town || addr.village || addr.county || addr.state || "Place";
      const country = addr.country || "";
      return {
        id: String(r.place_id),
        name: city,
        country,
        displayName: r.display_name,
        lat: parseFloat(r.lat),
        lng: parseFloat(r.lon),
      };
    });

    return NextResponse.json({ results });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ results: [], detail: "Search failed" }, { status: 500 });
  }
}
