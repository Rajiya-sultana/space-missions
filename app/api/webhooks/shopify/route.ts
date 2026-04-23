import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { adminDb } from "@/lib/firebase-admin";

function normalizePhone(phone: string | null | undefined): string | null {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) return `+91${digits}`;
  if (digits.length === 12 && digits.startsWith("91")) return `+${digits}`;
  if (digits.length > 10) return `+${digits}`;
  return null;
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();

  const hmacHeader = req.headers.get("x-shopify-hmac-sha256");
  const secret = process.env.SHOPIFY_WEBHOOK_SECRET!;
  const digest = crypto.createHmac("sha256", secret).update(rawBody).digest("base64");

  if (digest !== hmacHeader) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const order = JSON.parse(rawBody);

  // Only process Space Explorer Workbook orders
  const SPACE_EXPLORER_PRODUCT_ID = "10426881114406";
  const hasSpaceExplorer = order.line_items?.some(
    (item: { product_id: number | string }) => String(item.product_id) === SPACE_EXPLORER_PRODUCT_ID
  );

  if (!hasSpaceExplorer) {
    return NextResponse.json({ skipped: "Not a Space Explorer order" });
  }

  const customer = order.customer;

  const rawPhone =
    customer?.phone ||
    order.billing_address?.phone ||
    order.shipping_address?.phone;

  const phoneNumber = normalizePhone(rawPhone);

  if (!phoneNumber) {
    return NextResponse.json({ error: "No phone number in order" }, { status: 400 });
  }

  await adminDb.collection("purchases").add({
    phoneNumber,
    orderId: String(order.id),
    productName: order.line_items?.[0]?.title ?? "Space Explorer Workbook",
    productId: String(order.line_items?.[0]?.product_id ?? ""),
    purchaseDate: new Date(),
    amount: parseFloat(order.total_price ?? "0"),
    currency: order.currency ?? "INR",
    paymentStatus: order.financial_status ?? "paid",
    webhookReceivedAt: new Date(),
    customerName: `${customer?.first_name ?? ""} ${customer?.last_name ?? ""}`.trim(),
    customerEmail: customer?.email ?? "",
  });

  // Update hasPurchase flag if user already exists in Firestore
  const usersSnap = await adminDb.collection("users").where("phoneNumber", "==", phoneNumber).get();
  usersSnap.forEach((doc) => doc.ref.update({ hasPurchase: true }));

  return NextResponse.json({ success: true });
}
