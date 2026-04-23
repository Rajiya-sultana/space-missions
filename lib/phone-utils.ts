export function formatPhoneNumber(phone: string, countryCode = "91"): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith(countryCode)) return `+${digits}`;
  return `+${countryCode}${digits}`;
}

export function validatePhoneNumber(phone: string): boolean {
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 13;
}

export function normalizePhone(phone: string): string {
  if (!phone) return "";
  const digits = phone.replace(/\D/g, "");
  if (phone.startsWith("+")) return `+${digits}`;
  if (digits.length === 10) return `+91${digits}`;
  if (digits.length === 12 && digits.startsWith("91")) return `+${digits}`;
  return `+${digits}`;
}
