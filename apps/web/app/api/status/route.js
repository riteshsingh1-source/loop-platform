import { NextResponse } from "next/server";
import { getBroadcastStatus } from "../../../lib/broadcast.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const status = await getBroadcastStatus(request);
    return NextResponse.json(status, { headers: { "cache-control": "public, max-age=0, s-maxage=5, stale-while-revalidate=15" } });
  } catch (error) {
    console.error("Broadcast status lookup failed:", error.message);
    return NextResponse.json({ error: "Broadcast status is unavailable" }, { status: 503, headers: { "cache-control": "no-store" } });
  }
}
