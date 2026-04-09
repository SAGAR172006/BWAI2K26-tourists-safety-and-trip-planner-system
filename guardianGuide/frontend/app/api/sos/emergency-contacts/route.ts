import { NextRequest, NextResponse } from "next/server";

const backend =
  process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const lat = url.searchParams.get("lat");
  const lng = url.searchParams.get("lng");
  if (!lat || !lng) {
    return NextResponse.json({ detail: "lat and lng required" }, { status: 400 });
  }

  const res = await fetch(
    `${backend}/api/v1/sos/emergency-contacts?lat=${encodeURIComponent(lat)}&lng=${encodeURIComponent(lng)}`
  );
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
