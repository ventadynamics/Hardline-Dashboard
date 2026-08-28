import { NextResponse } from "next/server";
import { liveService } from "@/services";

/**
 * Live counters endpoint. The client polls it; when the real game API
 * arrives this route (or a WebSocket/SSE feed) proxies it instead.
 */
export async function GET() {
  const snapshot = await liveService.snapshot();
  return NextResponse.json(snapshot, {
    headers: { "cache-control": "no-store" },
  });
}
