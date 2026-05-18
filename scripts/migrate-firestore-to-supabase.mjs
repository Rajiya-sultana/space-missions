import { createClient } from "@supabase/supabase-js";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const PRODUCT_ID_TO_SLUG = {
  "10426881114406": "space-explorer",
};

const SUPABASE_URL = "https://yenwmelvmfpeibskamcv.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllbndtZWx2bWZwZWlic2thbWN2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODQ4MDg2NCwiZXhwIjoyMDk0MDU2ODY0fQ.NA3L8QyguwIWyoNKE9QknhxYEmEF7RZX0wIfHObeKsg";

const FIREBASE_ADMIN_SDK_KEY =
  "ewogICJ0eXBlIjogInNlcnZpY2VfYWNjb3VudCIsCiAgInByb2plY3RfaWQiOiAibGVhcm53aGF0bWF0dGVycy02ZGUzMiIsCiAgInByaXZhdGVfa2V5X2lkIjogIjMyZGU3NmQxYzgzMjk3MDZkMzJiY2ZmYjE4MWFiYWM5YWNkMzI4ZDIiLAogICJwcml2YXRlX2tleSI6ICItLS0tLUJFR0lOIFBSSVZBVEUgS0VZLS0tLS1cbk1JSUV2d0lCQURBTkJna3Foa2lHOXcwQkFRRUZBQVNDQktrd2dnU2xBZ0VBQW9JQkFRRHB0eGNiVHVacVlaM2dcbm8rVnFkZGlVZjlVVTROcEpEbnprL1YzWmhRQ3lXU09tTHM2UWJDMnQ4UnFUT3pDV3RmZWwvb0pLdjBTVWZUOHFcblo1Q0VMMlQ4QTRPK1pSTkNKak9mSm5FcmdOWndON1Z2Zy9qTmt5d2VDM1hweUpNZzRSb3RXWkhyMlYzQzdtY3Zcbk5mbEwrazlJWklSQVk0L2RhN2ZkL0puR21uajY3M1c4cnV5MEtTQlJsaEF1eU5KOWJrT2poQ09QR0E2cFdCYllcblBzS0lXZ1BDenVtbFVGNXB1OEJSbEp4VkwrYzZaSVp5czRjUFVZcDZmanRUeXJEUTVFSFBTVTUrRHlSTEZCdi9cbmE2U2VlUUgwNDNWRTFoMW5JUG9VZktHZnkrMnZsVGoxRUhNZks1Q2M5dTRuVUlkelFXd0p2UjNyalBmNTRZSldcbis2MFJDc2lWQWdNQkFBRUNnZ0VBS2h3dFcyUUNzNkc5aU1OM0cxQzY4bnk2NTUxZzd6OWZSUUlheGczSEU1dG9cbmh6R1JVZWZQN2pLT00zOTdjSGcrZEFmd3NXZVhnM3F5cGlFTllxZklkZmpySktQQkRjN2t4N1R0T0tXbzNZVElcbkdkenBPQjhmbUpVL2pGMHhseisvei9KK3pvUTJkdUF1TXMweWl4eEJhejJETDdmUXJOaFRBM29YT2ZmTXV3ZVFcbm9jNzVtKzRucEJmU0E0SFpNT2luQ1BGVG1lOEJCWDBPOTltOTZNc25VRzBqNFY3ZWl5NDMzTjdBcmszUFE2YVJcbk95NlFHdEVjUGZTdkdieUpNem5UQW5oMndhMytrQ1BPa0JZdnpTUkg1YW5MV2JZNlZuRm54cmFOZ3hVUVJLVitcbjM1dlRVYUtpYnhVdUxtQ0E4RWVUdzVHK3YzQzdjbGF5T2hwRTc1SWNpUUtCZ1FENU5OOUtJbWR2UVk0L2ZCREZcbmhTUU9WQUdDVURBczdaV2poci9wOEpVS1lmSEVOQlhzdFUxT3NMU0szd1ltUHBiQnJnQWxjSzZZOW5XSlcreUVcbmhycjM4NmVjczdMK0xDUE1DTHd1VHc2U21RY3JwL1luZE0wQ1g0VUh2bVl1ek5KNFcwZGRydHpqR0gxSy80ODBcbjc2ZlV2QVNHeDd5dTNqajlFNzZnL09TRmVRS0JnUUR3Rmh2NG85cDk0em1IcnpjWnYveEsyN016MFNJck5NL3JcbmdlbWxVR1NVQTArdlFxSVI0Uk5Bbi9Ud2RWV0V0REwrZFUyVlRvdjd1RmFHT0Y5K2Y4T1NwQzVJWlluSTh2M0Ncbm4rOFJUQThkRkhjRUErVTJLZXVqemIxeUdGMWxra3ZJeEMwS010Yy9lTVArUUp6SG1FbWJxSFlqOWxCTDBRUm5cblF5RlJaSEhnL1FLQmdRRGVrOUNUQUNOdUJSa3RybnUwVHZRakwvaWhFVW5WOXVWZHhxNkdIWENnYzFaaUxUc2ZcbnpkYWNYOHNBOWEwaVgyaDYyQlFkWElVMDdYdVJFVjh3QnIzYlUrM3lVYldldW9IR2JFN1c5WmxJYWhFemRyS3VcbkR1NUVIbGhNMEV1bnBSeWVqcmd3L2tzZk1mSkdGL2NxQ3ByVnNKQkNhUWNuRUNmS01lWmpGenhyMFFLQmdRQ0lcbnBxenBDcW96K1A4bndZMEZOUWN1dkhuMVJsWENiZDdpVnlGYm5MU0NvcGZhVTN6WDNGb084SHlEMk9VQ0VXYnNcbittdGNUa2JTMFlzOS9od3NiaUFzK1JIMjF3Ump3aHE1aWpxU2g4NGFhU21NdVlMZkgyRWw3TmFsZUVUQXFWSkZcblJaTzFPRmJYbzY4NnFpQVNZeFdTYVlKRTJjKytONHZnRW8rR09qdXZLUUtCZ1FDclBlQ0xFLzdmNW9xREdlMC9cbmFsQzUzS2p3UlhHY09tbUFkeFRGOUcxWlo3T3Nuc1czRHlpaUlnQkJITEgyTzZScm9pWmZTOFdTajlPdG4yRVpcbitrYkRTdHRENUlpUzJSSTFYQVlFd1VnWlFtRTQ5RVVLVi84bFRRMTlFT1czMmZGaTVqYmZnYkxqQndocTdsNkdcbjJ5YklNMGZNWjV5dC94cWpMdmxqdm96VkxBPT1cbi0tLS0tRU5EIFBSSVZBVEUgS0VZLS0tLS1cbiIsCiAgImNsaWVudF9lbWFpbCI6ICJmaXJlYmFzZS1hZG1pbnNkay1mYnN2Y0BsZWFybndoYXRtYXR0ZXJzLTZkZTMyLmlhbS5nc2VydmljZWFjY291bnQuY29tIiwKICAiY2xpZW50X2lkIjogIjEwODExMDIyMjc0NTcwNzY0NzMwNSIsCiAgImF1dGhfdXJpIjogImh0dHBzOi8vYWNjb3VudHMuZ29vZ2xlLmNvbS9vL29hdXRoMi9hdXRoIiwKICAidG9rZW5fdXJpIjogImh0dHBzOi8vb2F1dGgyLmdvb2dsZWFwaXMuY29tL3Rva2VuIiwKICAiYXV0aF9wcm92aWRlcl94NTA5X2NlcnRfdXJsIjogImh0dHBzOi8vd3d3Lmdvb2dsZWFwaXMuY29tL29hdXRoMi92MS9jZXJ0cyIsCiAgImNsaWVudF94NTA5X2NlcnRfdXJsIjogImh0dHBzOi8vd3d3Lmdvb2dsZWFwaXMuY29tL3JvYm90L3YxL21ldGFkYXRhL3g1MDkvZmlyZWJhc2UtYWRtaW5zZGstZmJzdmMlNDBsZWFybndoYXRtYXR0ZXJzLTZkZTMyLmlhbS5nc2VydmljZWFjY291bnQuY29tIiwKICAidW5pdmVyc2VfZG9tYWluIjogImdvb2dsZWFwaXMuY29tIgp9Cg==";

// Init Firebase Admin
const serviceAccount = JSON.parse(
  Buffer.from(FIREBASE_ADMIN_SDK_KEY, "base64").toString("utf8")
);
initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

// Init Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function migrate() {
  console.log("Fetching all purchases from Firestore...");
  const snapshot = await db.collection("purchases").get();
  console.log(`Found ${snapshot.size} documents.`);

  const rows = [];

  snapshot.forEach((doc) => {
    const d = doc.data();
    const productSlug =
      d.productSlug ||
      (d.productId ? PRODUCT_ID_TO_SLUG[String(d.productId)] : null);

    if (!productSlug) {
      console.warn(`Skipping doc ${doc.id} — unknown productId: ${d.productId}`);
      return;
    }

    rows.push({
      phone_number: d.phoneNumber ?? null,
      product_slug: productSlug,
      order_id: d.orderId ?? null,
      product_name: d.productName ?? null,
      product_id: d.productId ? String(d.productId) : null,
      amount: d.amount ?? null,
      currency: d.currency ?? "INR",
      payment_status: d.paymentStatus ?? null,
      customer_name: d.customerName ?? null,
      customer_email: d.customerEmail ?? null,
    });
  });

  console.log(`Migrating ${rows.length} rows to Supabase...`);

  // Insert in batches of 100
  const BATCH = 100;
  for (let i = 0; i < rows.length; i += BATCH) {
    const batch = rows.slice(i, i + BATCH);
    const { error } = await supabase.from("purchases").insert(batch);
    if (error) {
      console.error(`Error inserting batch ${i / BATCH + 1}:`, error);
    } else {
      console.log(`Batch ${i / BATCH + 1} inserted (${batch.length} rows)`);
    }
  }

  console.log("Migration complete!");
}

migrate().catch(console.error);
