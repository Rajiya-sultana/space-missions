import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

function getAdminApp() {
  if (getApps().length > 0) return getApps()[0];

  const base64Key = process.env.FIREBASE_ADMIN_SDK_KEY!;
  const serviceAccount = JSON.parse(Buffer.from(base64Key, "base64").toString("utf-8"));

  return initializeApp({
    credential: cert(serviceAccount),
  });
}

const adminApp = getAdminApp();

export const adminDb = getFirestore(adminApp);
export const adminAuth = getAuth(adminApp);
