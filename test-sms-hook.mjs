import crypto from "crypto";

// Config
const FUNCTION_URL = "https://yenwmelvmfpeibskamcv.supabase.co/functions/v1/sms-hook";
const SECRET = "test-secret"; // matches SUPABASE_WEBHOOK_SECRET default in the function
const TEST_PHONE = "+916200852828";
const TEST_OTP = "123456";

// Build payload (matches Supabase auth hook format)
const payload = JSON.stringify({
  user: { phone: TEST_PHONE },
  sms: { otp: TEST_OTP },
});

// Sign with StandardWebhooks spec
const webhookId = `msg-test-${Date.now()}`;
const timestamp = Math.floor(Date.now() / 1000).toString();
const signingKey = Buffer.from(SECRET).toString("base64"); // btoa(secret)
const toSign = `${webhookId}.${timestamp}.${payload}`;
const hmac = crypto.createHmac("sha256", Buffer.from(signingKey, "base64"));
hmac.update(toSign);
const signature = `v1,${hmac.digest("base64")}`;

console.log("Sending to:", FUNCTION_URL);
console.log("Phone:", TEST_PHONE, "| OTP:", TEST_OTP);

const res = await fetch(FUNCTION_URL, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "webhook-id": webhookId,
    "webhook-timestamp": timestamp,
    "webhook-signature": signature,
  },
  body: payload,
});

const body = await res.json();
console.log("Status:", res.status);
console.log("Response:", JSON.stringify(body, null, 2));
