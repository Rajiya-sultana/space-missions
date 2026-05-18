import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { supabase } from "@/lib/supabase-admin";
import { PRODUCT_ID_TO_SLUG } from "@/data/products";

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

  const customer = order.customer;
  const rawPhone =
    customer?.phone ||
    order.billing_address?.phone ||
    order.shipping_address?.phone;

  const phoneNumber = normalizePhone(rawPhone);
  const customerEmail = (customer?.email ?? "").trim().toLowerCase();

  if (!phoneNumber && !customerEmail) {
    return NextResponse.json({ error: "No phone or email in order" }, { status: 400 });
  }

  const lineItems: Array<{ product_id: number | string; title: string }> =
    order.line_items ?? [];

  const rows: object[] = [];

  for (const item of lineItems) {
    const productSlug = PRODUCT_ID_TO_SLUG[String(item.product_id)];
    if (!productSlug) continue;

    rows.push({
      phone_number: phoneNumber,
      product_slug: productSlug,
      order_id: String(order.id),
      product_name: item.title,
      product_id: String(item.product_id),
      amount: parseFloat(order.total_price ?? "0"),
      currency: order.currency ?? "INR",
      payment_status: order.financial_status ?? "paid",
      customer_name: `${customer?.first_name ?? ""} ${customer?.last_name ?? ""}`.trim(),
      customer_email: customerEmail,
    });
  }

  if (rows.length === 0) {
    return NextResponse.json({ skipped: "No known products in order" });
  }

  const { error } = await supabase.from("purchases").insert(rows);

  if (error) {
    console.error("Supabase insert error:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }

  return NextResponse.json({ success: true, productsProcessed: rows.length });
}
