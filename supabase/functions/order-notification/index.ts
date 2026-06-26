// supabase/functions/order-notification/index.ts
import { smsOrderReceived } from "../../src/lib/sms.ts";

Deno.serve(async (req) => {
  const { farmerPhone, buyerName, crop, qty, total } = await req.json();
  await smsOrderReceived(farmerPhone, buyerName, crop, qty, total);
  return new Response("ok");
});