import { NextResponse } from "next/server";
import { startBroadcast, stopBroadcast } from "../../../../lib/broadcast.js";
import { hasValidAdminToken } from "../../../../lib/auth.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function POST(request) {
  if (!hasValidAdminToken(request)) {
    return NextResponse.json({ error: "Admin token is invalid" }, { status: 401 });
  }

  try {
    const body = await request.json();
    if (body.live === true) {
      return NextResponse.json(await startBroadcast(request), { status: 202 });
    }
    if (body.live === false) {
      return NextResponse.json(await stopBroadcast(request));
    }
    return NextResponse.json({ error: "Expected { live: true|false }" }, { status: 400 });
  } catch (error) {
    console.error("Broadcast command failed:", error.message);
    return NextResponse.json({ error: "Could not update broadcast state" }, { status: 502 });
  }
}
