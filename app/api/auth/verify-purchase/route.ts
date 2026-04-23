import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function POST(req: NextRequest) {
  const { phone } = await req.json();

  if (!phone) {
    return NextResponse.json({ error: "Phone number required" }, { status: 400 });
  }

  const normalized = phone.trim();

  const snapshot = await adminDb
    .collection("purchases")
    .where("phoneNumber", "==", normalized)
    .limit(1)
    .get();
  if (snapshot.empty) {
    return NextResponse.json({ hasPurchase: false });
  }

  const purchase = snapshot.docs[0].data();
  return NextResponse.json({
    hasPurchase: true,
    purchaseDetails: {
      productName: purchase.productName,
      purchaseDate: purchase.purchaseDate,
      orderId: purchase.orderId,
    },
  });
}
