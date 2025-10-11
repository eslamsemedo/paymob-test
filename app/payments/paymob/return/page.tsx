import Script from "next/script";

// Next App Router shape for searchParams
type SearchParams = { [key: string]: string | string[] | undefined };

// Normalize to plain string map
function normalize(sp: SearchParams): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(sp)) {
    out[k] = Array.isArray(v) ? String(v?.[0] ?? "") : String(v ?? "");
  }
  return out;
}

async function verifyWithService(sp: SearchParams) {
  const params = normalize(sp);
  const base = process.env.PAYMOB_SERVICE_URL!;
  const url = new URL("/api/paymob/redirection-verify", base);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);

  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) {
    return { ok: false, verified: false, success: false };
  }
  return res.json();
}

export default async function PaymobReturn({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const result = await verifyWithService(searchParams);

  return (
    <main style={{ maxWidth: 640, margin: "3rem auto", fontFamily: "system-ui" }}>
      {/* Bust out of the Paymob iframe so this page takes over the tab */}
      <Script id="frame-buster" strategy="afterInteractive">
        {`if (window.top !== window.self) { window.top.location.href = window.location.href; }`}
      </Script>

      <h1>Payment {result.success ? "Successful" : "Failed"}</h1>
      <p>
        Status: <b>{result.success ? "Paid" : "Not paid"}</b>{" "}
        {result.verified ? "" : "(unverified)"}
      </p>
      <ul>
        <li>Order ID: {result.order_id ?? "n/a"}</li>
        <li>Transaction ID: {result.tx_id ?? "n/a"}</li>
        <li>
          Amount:{" "}
          {result.amount_cents ? (Number(result.amount_cents) / 100).toFixed(2) : "-"}{" "}
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