// app/checkout/page.tsx
import { createCheckout } from "@/actions/checkout";
export default async function Page() {
  const data = await createCheckout(150, {
    first_name: "Sara", last_name: "A.",
    email: "sara@example.com", phone_number: "+20100..."
  });
  // Option 1: Hosted iFrame
  return (
    <iframe src={data.iframe_url} width="100%" height="650" allow="payment" />
  );
}