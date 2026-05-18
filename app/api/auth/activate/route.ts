import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase-admin";
import { products } from "@/data/products";

const VALID_SLUGS = ["space-explorer", "fun-science", "young-hustler"];

export async function POST(req: NextRequest) {
  const { email, password, productSlug } = await req.json();

  if (!email || !password || !productSlug) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  if (!VALID_SLUGS.includes(productSlug)) {
    return NextResponse.json({ error: "Invalid product" }, { status: 400 });
  }

  const normalizedEmail = String(email).trim().toLowerCase();

  // Create Supabase auth user — email_confirm:true bypasses email verification
  const { error: createError } = await supabase.auth.admin.createUser({
    email: normalizedEmail,
    password,
    email_confirm: true,
  });

  if (createError) {
    const msg = createError.message.toLowerCase();
    if (msg.includes("already") || msg.includes("registered")) {
      return NextResponse.json({ error: "already_exists" }, { status: 409 });
    }
    console.error("[activate] createUser error:", createError);
    return NextResponse.json({ error: createError.message }, { status: 500 });
  }

  // Insert purchase row so verify-purchases grants access
  const product = products.find((p) => p.slug === productSlug);
  const { error: purchaseError } = await supabase.from("purchases").insert({
    customer_email: normalizedEmail,
    product_slug: productSlug,
    product_id: product?.shopifyProductId ?? "",
    product_name: product?.title ?? productSlug,
    payment_status: "paid",
    currency: "INR",
  });

  if (purchaseError) {
    console.error("[activate] purchase insert error:", purchaseError);
    // User was created — don't block them, they can still sign in
  }

  return NextResponse.json({ success: true });
}
