// app/api/webhooks/paymob/route.ts
import { NextRequest, NextResponse } from "next/server";
export const runtime = "nodejs"; // important
export async function POST(req: NextRequest) {
  const payload = await req.json(); // Paymob "processed" callback
  // Forward to microservice (or re-use verify code here)
  await fetch(process.env.PAYMOB_SERVICE_URL + "/webhooks/paymob", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload)
  });
  return NextResponse.json({ ok: true });
}