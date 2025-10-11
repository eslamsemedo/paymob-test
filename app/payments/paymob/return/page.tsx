// app/payments/paymob/return/page.tsx
import { Suspense } from "react";

async function verify(searchParams: Record<string, string>) {
  // Call your microservice to verify HMAC (and optionally inquiry)
  const u = new URL(process.env.PAYMOB_SERVICE_URL + "/api/paymob/redirection-verify");
  Object.entries(searchParams).forEach(([k, v]) => u.searchParams.set(k, v));
  const res = await fetch(u.toString(), { cache: "no-store" });
  return res.json();
}

export default async function PaymobReturn({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  const result = await verify(searchParams);

  // Render a simple receipt UI
  return (
    <main style={{ maxWidth: 600, margin: "3rem auto", fontFamily: "system-ui" }}>
      <h1>Payment {result.success ? "Successful" : "Failed"}</h1>
      <p>
        Status: <b>{result.success ? "Paid" : "Not paid"}</b>
        {result.verified ? "" : " (unverified)"}
      </p>
      <ul>
        <li>Order ID: {result.order_id ?? "n/a"}</li>
        <li>Transaction ID: {result.tx_id ?? "n/a"}</li>
        <li>
          Amount: {result.amount_cents ? (Number(result.amount_cents) / 100).toFixed(2) : "-"}{" "}
          {result.currency || "EGP"}
        </li>
      </ul>

      {result.success ? (
        <p>Thanks! Your payment has been received.</p>
      ) : (
        <p>Payment didn’t go through. You can try again or use another method.</p>
      )}
    </main>
  );
}