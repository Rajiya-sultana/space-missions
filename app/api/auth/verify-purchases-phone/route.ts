import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase-admin";
import { normalizePhone } from "@/lib/phone-utils";

export async function POST(req: NextRequest) {
  const { phone } = await req.json();

  if (!phone) return NextResponse.json({ purchases: {} });

  const normalized = normalizePhone(phone);

  const { data, error } = await supabase
    .from("purchases")
    .select("product_slug")
    .eq("phone_number", normalized);

  if (error) {
    console.error("verify-purchases-phone error:", error);
    return NextResponse.json({ purchases: {} });
  }

  const purchases: Record<string, boolean> = {};
  (data ?? []).forEach((row: { product_slug: string }) => {
    if (row.product_slug) purchases[row.product_slug] = true;
  });

  return NextResponse.json({ purchases });
}
