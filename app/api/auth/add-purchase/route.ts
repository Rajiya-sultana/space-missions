import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase-admin";
import { products } from "@/data/products";

const VALID_SLUGS = ["space-explorer", "fun-science", "young-hustler"];

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const token = authHeader.slice(7);

  // Verify the session token
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { productSlug } = await req.json();
  if (!VALID_SLUGS.includes(productSlug)) {
    return NextResponse.json({ error: "Invalid product" }, { status: 400 });
  }

  const email = user.email.toLowerCase();
  const product = products.find((p) => p.slug === productSlug);

  // Only insert if no purchase record already exists for this email + product
  const { data: existing } = await supabase
    .from("purchases")
    .select("id")
    .eq("customer_email", email)
    .eq("product_slug", productSlug)
    .limit(1);

  if (!existing || existing.length === 0) {
    const { error: purchaseError } = await supabase.from("purchases").insert({
      customer_email: email,
      product_slug: productSlug,
      product_id: product?.shopifyProductId ?? "",
      product_name: product?.title ?? productSlug,
      payment_status: "paid",
      currency: "INR",
    });

    if (purchaseError) {
      console.error("[add-purchase] insert error:", purchaseError);
    }
  }

  return NextResponse.json({ success: true });
}
