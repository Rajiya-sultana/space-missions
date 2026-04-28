import { readFileSync } from "fs";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import { parse } from "csv-parse/sync";
import { config } from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, "../.env.local") });

// Init Firebase Admin
const base64Key = process.env.FIREBASE_ADMIN_SDK_KEY;
const serviceAccount = JSON.parse(Buffer.from(base64Key, "base64").toString("utf-8"));
if (!getApps().length) {
  initializeApp({ credential: cert(serviceAccount) });
}
const db = getFirestore();

function formatPhone(raw) {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("91") && digits.length === 12) return `+${digits}`;
  if (digits.length === 10) return `+91${digits}`;
  return `+${digits}`;
}

const csvRaw = readFileSync("/Users/bizlyft/Downloads/orders_export_1.csv", "utf-8");
const rows = parse(csvRaw, { columns: true, skip_empty_lines: true });

const spaceOrders = rows.filter(
  (r) =>
    r["Lineitem name"].includes("Space Explorer Workbook") &&
    r["Financial Status"] === "paid"
);

console.log(`Found ${spaceOrders.length} Space Explorer Workbook paid orders\n`);

let success = 0;
let skipped = 0;
let failed = 0;

for (const row of spaceOrders) {
  const rawPhone = row["Billing Phone"] || row["Shipping Phone"];
  if (!rawPhone) {
    console.log(`⚠️  Skipped ${row["Name"]} — no phone number`);
    skipped++;
    continue;
  }

  const phoneNumber = formatPhone(rawPhone);
  const orderId = row["Name"];
  const docId = `shopify_${orderId.replace("#", "")}`;

  // Check if already exists
  const existing = await db.collection("purchases").doc(docId).get();
  if (existing.exists) {
    console.log(`⏭️  Skipped ${orderId} — already in Firestore`);
    skipped++;
    continue;
  }

  const purchaseDate = new Date(row["Created at"]);

  try {
    await db.collection("purchases").doc(docId).set({
      phoneNumber,
      orderId,
      productName: row["Lineitem name"],
      purchaseDate: Timestamp.fromDate(purchaseDate),
      amount: parseFloat(row["Total"]),
      currency: row["Currency"] || "INR",
      paymentStatus: "paid",
      customerEmail: row["Email"] || "",
      customerName: row["Billing Name"] || row["Shipping Name"] || "",
      webhookReceivedAt: Timestamp.now(),
      source: "csv_import",
    });
    console.log(`✅  Imported ${orderId} — ${phoneNumber}`);
    success++;
  } catch (err) {
    console.log(`❌  Failed ${orderId} — ${err.message}`);
    failed++;
  }
}

console.log(`\n--- Done ---`);
console.log(`✅  Imported: ${success}`);
console.log(`⏭️  Skipped:  ${skipped}`);
console.log(`❌  Failed:   ${failed}`);
