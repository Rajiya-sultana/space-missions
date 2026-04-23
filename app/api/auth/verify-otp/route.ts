import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

export async function POST(req: NextRequest) {
  const { idToken, phoneNumber } = await req.json();

  if (!idToken) {
    return NextResponse.json({ error: "No token provided" }, { status: 400 });
  }

  try {
    const decoded = await adminAuth.verifyIdToken(idToken);

    // Create or update user in Firestore
    const userRef = adminDb.collection("users").doc(decoded.uid);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      await userRef.set({
        uid: decoded.uid,
        phoneNumber: phoneNumber ?? decoded.phone_number,
        createdAt: new Date(),
        lastLoginAt: new Date(),
        hasPurchase: false,
      });
    } else {
      await userRef.update({ lastLoginAt: new Date() });
    }

    return NextResponse.json({ success: true, uid: decoded.uid });
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
