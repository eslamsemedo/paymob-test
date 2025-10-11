"use server";
export async function createCheckout(amountEGP: number, customer: any) {
  console.log("url:", process.env.PAYMOB_SERVICE_URL);
  try {

    const res = await fetch(process.env.PAYMOB_SERVICE_URL + "/api/paymob/checkout/card", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ amountEGP, customer })
    });
    return res.json(); // { order_id, payment_key, iframe_url }
  } catch (error) {
    console.error("Error creating checkout:", error);
    throw new Error("Checkout creation failed");
  }
}