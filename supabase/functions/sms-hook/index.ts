import { Webhook } from "https://esm.sh/standardwebhooks@1.0.0";

const WEBHOOK_SECRET = Deno.env.get("SUPABASE_WEBHOOK_SECRET") ?? "test-secret";
const MSG91_AUTHKEY  = Deno.env.get("MSG91_AUTHKEY")!;

function normalizePhone(phone: string): string {
  const digits = phone.replace(/[^\d]/g, "");
  if (digits.length === 10) return `91${digits}`;
  if (digits.length === 12 && digits.startsWith("91")) return digits;
  if (phone.startsWith("+91")) return phone.replace("+", "");
  return digits;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { status: 200 });
  }
  try {
    const payload = await req.text();
    const headers = Object.fromEntries(req.headers);
    const wh = new Webhook(btoa(WEBHOOK_SECRET));
    const data = wh.verify(payload, headers) as any;

    const phone = data?.user?.phone ?? "";
    const otp   = data?.sms?.otp   ?? "";

    if (!phone || !otp) {
      return new Response(JSON.stringify({ error: "Missing phone or OTP" }), { status: 400 });
    }

    const mobile = normalizePhone(phone);
    const url = `https://api.msg91.com/api/v5/otp?template_id=&mobile=${mobile}&authkey=${MSG91_AUTHKEY}&otp=${otp}&otp_expiry=5`;

    const res = await fetch(url, { method: "GET" });
    const result = await res.json();
    console.log("MSG91 response:", JSON.stringify(result));

    return new Response(JSON.stringify({ success: true }), { status: 200 });

  } catch (err) {
    console.error("SMS hook error:", err);
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
});
