// src/lib/sms.ts
// Africa's Talking SMS — fires when escrow events happen.
// This runs ONLY server-side (Supabase Edge Function or TanStack Start server route).
// Never expose AT_API_KEY client-side.
//
// SETUP:
//  1. Create a free Africa's Talking sandbox at https://account.africastalking.com
//  2. Add to your .env:
//       AT_USERNAME=sandbox          (use "sandbox" for testing)
//       AT_API_KEY=your_api_key_here
//       AT_SENDER_ID=AgriLink        (request short code in production)
//  3. Deploy as a Supabase Edge Function or TanStack Start API route.

const AT_BASE =
  process.env.AT_USERNAME === "sandbox"
    ? "https://api.sandbox.africastalking.com/version1/messaging"
    : "https://api.africastalking.com/version1/messaging";

interface SMSOptions {
  to: string;         // E.164 format: +233241234567
  message: string;
}

export async function sendSMS({ to, message }: SMSOptions): Promise<boolean> {
  const username = process.env.AT_USERNAME;
  const apiKey = process.env.AT_API_KEY;
  if (!username || !apiKey) {
    console.warn("[SMS] Africa's Talking credentials not set — SMS skipped.");
    return false;
  }

  const body = new URLSearchParams({
    username,
    to,
    message,
    from: process.env.AT_SENDER_ID ?? "AgriLink",
  });

  try {
    const res = await fetch(AT_BASE, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        apiKey,
      },
      body: body.toString(),
    });
    const json = await res.json();
    const ok = json?.SMSMessageData?.Recipients?.[0]?.status === "Success";
    if (!ok) console.error("[SMS] AT error:", JSON.stringify(json));
    return ok;
  } catch (e) {
    console.error("[SMS] Network error:", e);
    return false;
  }
}

// ── Convenience wrappers for AgriLink events ──────────────────────────────

export async function smsOrderReceived(
  farmerPhone: string,
  buyerName: string,
  crop: string,
  qty: number,
  total: number
) {
  return sendSMS({
    to: farmerPhone,
    message: `AgriLink: New order! ${buyerName} ordered ${qty}kg of ${crop} for GHS ${total.toFixed(2)}. Funds held in escrow. Log in to confirm.`,
  });
}

export async function smsEscrowReleased(
  farmerPhone: string,
  crop: string,
  amount: number
) {
  return sendSMS({
    to: farmerPhone,
    message: `AgriLink: GHS ${amount.toFixed(2)} for your ${crop} delivery has been released to your wallet. Withdraw via MoMo anytime.`,
  });
}

export async function smsOrderPlaced(
  buyerPhone: string,
  crop: string,
  qty: number,
  total: number
) {
  return sendSMS({
    to: buyerPhone,
    message: `AgriLink: Your order for ${qty}kg of ${crop} (GHS ${total.toFixed(2)}) is confirmed. Funds are held in escrow until delivery.`,
  });
}

export async function smsDeliveryConfirmed(
  buyerPhone: string,
  crop: string
) {
  return sendSMS({
    to: buyerPhone,
    message: `AgriLink: Delivery of ${crop} confirmed. Thank you for using AgriLink. Rate your experience in the app.`,
  });
}