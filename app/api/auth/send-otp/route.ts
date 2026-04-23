import { NextRequest, NextResponse } from "next/server";
import { validatePhoneNumber, formatPhoneNumber } from "@/lib/phone-utils";

export async function POST(req: NextRequest) {
  const { phoneNumber, countryCode } = await req.json();

  if (!phoneNumber || !validatePhoneNumber(phoneNumber)) {
    return NextResponse.json({ error: "Invalid phone number" }, { status: 400 });
  }

  const formatted = formatPhoneNumber(phoneNumber, countryCode ?? "91");

  // OTP is sent client-side via Firebase SDK (RecaptchaVerifier requires browser)
  // This endpoint just validates the phone format and returns it
  return NextResponse.json({ success: true, phoneNumber: formatted });
}
