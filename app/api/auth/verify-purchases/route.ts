import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase-admin";

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }

  const normalized = String(email).trim().toLowerCase();

  const { data, error } = await supabase
    .from("purchases")
    .select("product_slug")
    .eq("customer_email", normalized);

  if (error) {
    console.error("Supabase query error:", error);
    return NextResponse.json({ purchases: {} });
  }

  const purchases: Record<string, boolean> = {};
  (data ?? []).forEach((row: { product_slug: string }) => {
    if (row.product_slug) purchases[row.product_slug] = true;
  });

  return NextResponse.json({ purchases });
}
