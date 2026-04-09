import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(list) {
          try {
            list.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            /* ignore */
          }
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("trips")
    .select("id,name,destination,destination_id,status,start_date,end_date,created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ detail: error.message }, { status: 500 });
  }

  const trips = (data ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    destination: row.destination ?? undefined,
    destinationId: row.destination_id ?? undefined,
    status: row.status ?? "idle",
    startDate: row.start_date ?? undefined,
    endDate: row.end_date ?? undefined,
  }));

  return NextResponse.json({ trips });
}

export async function POST(req: NextRequest) {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(list) {
          try {
            list.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            /* ignore */
          }
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const name = typeof body.name === "string" && body.name.trim() ? body.name.trim() : "New Trip";
  const destination = typeof body.destination === "string" ? body.destination : null;

  const { data, error } = await supabase
    .from("trips")
    .insert({
      user_id: user.id,
      name,
      destination,
      status: body.status ?? "planning",
    })
    .select("id,name,destination,destination_id,status,start_date,end_date")
    .single();

  if (error) {
    return NextResponse.json({ detail: error.message }, { status: 500 });
  }

  const trip = {
    id: data.id,
    name: data.name,
    destination: data.destination ?? undefined,
    destinationId: data.destination_id ?? undefined,
    status: data.status ?? "planning",
    startDate: data.start_date ?? undefined,
    endDate: data.end_date ?? undefined,
  };

  return NextResponse.json({ trip });
}
