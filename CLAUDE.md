CLAUDE.md - Firebase + Shopify Webhook Authentication (Mobile OTP)
🎯 Project Overview
Platform: https://watch.learnwhatmatters.in/ (Next.js video learning platform) Features:

Firebase Authentication (mobile number + OTP login)
Shopify Webhook integration (real-time purchase tracking)
Purchase verification system
Automated access control

Goal: Users log in via mobile OTP → System checks Shopify webhook data → Grant/deny access to Missions 2-10


📋 Complete Process Overview
How It Works (Step-by-Step)
CUSTOMER JOURNEY:

┌─────────────────────────────────────────────────────────┐

│ 1. Customer buys product on Shopify store               │

│    ↓                                                     │

│ 2. Shopify sends WEBHOOK to your server                 │

│    (order.created event with customer phone & product)  │

│    ↓                                                     │

│ 3. Your backend receives webhook                        │

│    ↓                                                     │

│ 4. Store purchase data in Firebase Firestore            │

│    (indexed by phone number: +91XXXXXXXXXX)             │

│    ↓                                                     │

│ 5. Customer comes to watch.learnwhatmatters.in          │

│    ↓                                                     │

│ 6. Clicks "Mission 2" (or any paid mission)             │

│    ↓                                                     │

│ 7. Not logged in? → Show LoginComponent                 │

│    ↓                                                     │

│ 8. User enters mobile number (+91XXXXXXXXXX)            │

│    ↓                                                     │

│ 9. Firebase sends OTP via SMS                           │

│    ↓                                                     │

│ 10. User enters 6-digit OTP                             │

│    ↓                                                     │

│ 11. Firebase verifies OTP                               │

│    ↓                                                     │

│ 12. System checks Firestore:                            │

│     "Does this phone have a purchase record?"           │

│    ↓                                                     │

│ 13. If YES → Grant access to video                      │

│     If NO → Show "Purchase first" message               │

└─────────────────────────────────────────────────────────┘

MISSION 1 (FREE):

└─ No login required, anyone can watch


🏗️ Technical Architecture
Three Main Components:
1️⃣ FIREBASE (Authentication + Database)
Firebase Project Setup:

├── Authentication

│   ├── Phone authentication (OTP via SMS)

│   ├── User profiles indexed by phone

│   └── Session management with tokens

│

├── Firestore Database

│   ├── Collection: users

│   │   ├── Document: {uid}

│   │   ├── Fields: phoneNumber, name, countryCode, createdAt

│   │

│   ├── Collection: purchases

│   │   ├── Document: {purchaseId}

│   │   ├── Fields: phoneNumber, productName, orderId, orderDate, amount

│   │

│   └── Collection: access_logs

│       ├── Document: {logId}

│       ├── Fields: userId, missionId, timestamp, accessGranted
2️⃣ SHOPIFY WEBHOOK (Real-time Purchase Notifications)
Shopify → Your Server:

┌─────────────────────────────────────────┐

│ Event: order.created                    │

│ Data sent:                              │

│ {                                       │

│   "order_id": 12345,                    │

│   "customer": {                         │

│     "phone": "+91XXXXXXXXXX",           │

│     "first_name": "John",               │

│     "last_name": "Doe"                  │

│   },                                    │

│   "line_items": [{                      │

│     "title": "Space Explorer Workbook", │

│     "product_id": 789,                  │

│     "quantity": 1                       │

│   }],                                   │

│   "total_price": "500.00"               │

│ }                                       │

└─────────────────────────────────────────┘

     ↓

Your Server Receives & Processes

     ↓

Stores in Firebase Firestore (indexed by phone)
3️⃣ NEXT.JS FRONTEND (Login + Access Control)
User Flow:

1. Visits /mission/2

2. Check: Is user logged in? (Firebase)

3. If NO → Show Login Component (mobile input)

4. User enters mobile + gets OTP

5. User enters OTP → Firebase verifies

6. Check Firestore: "Has phone purchased?"

7. If purchased → Show Video Player

8. If not purchased → Show "Purchase now" CTA


🔑 Step-by-Step Setup Process
STEP 1: Firebase Setup (5 minutes)
1a. Create Firebase Project
1. Go to: https://console.firebase.google.com

2. Click "Create a new project"

3. Name: "LearnWhatMatters" (or your choice)

4. Enable Analytics (optional)

5. Create project
1b. Enable Phone Authentication
1. In Firebase Console → Authentication

2. Click "Get started"

3. Enable "Phone" provider (NOT Email/Password)

4. Configure reCAPTCHA (for security)

5. Save
1c. Create Firestore Database
1. In Firebase Console → Firestore Database

2. Click "Create database"

3. Start in "Production mode"

4. Choose region: "asia-south1" (closest to Kolkata)

5. Create database

6. Create Collections:

   a. "users" (will auto-create on signup)

   b. "purchases" (for webhook data, indexed by phoneNumber)

   c. "access_logs" (optional, for tracking)

7. Create Indexes:

   Collection: purchases

   Field: phoneNumber (Ascending)
1d. Get Firebase Config
1. Project Settings → Your apps

2. Select "Web" app (or create one)

3. Copy the config object:

   {

     apiKey: "YOUR_API_KEY",

     authDomain: "yourproject.firebaseapp.com",

     projectId: "yourproject",

     storageBucket: "yourproject.appspot.com",

     messagingSenderId: "123456789",

     appId: "1:123456789:web:abc123def456"

   }

4. Store in .env.local file


STEP 2: Shopify Webhook Setup (10 minutes)
2a. Get Shopify API Credentials
1. Log in to Shopify Admin Dashboard

2. Go: Settings → Apps and integrations → Develop apps

3. Create an app (if you don't have one)

4. Get: API key & access token

5. Store in .env.local
2b. Register Webhook Endpoint
1. In Shopify App Admin:

   → Webhooks → Create webhook

2. Webhook Details:

   Event: "Order created" (orders/create)

   URL: https://watch.learnwhatmatters.in/api/webhooks/shopify

   Format: JSON

   API version: Latest stable

3. Save & test webhook
2c. Test Webhook (Optional but Recommended)
1. In Shopify Admin → Webhooks

2. Find your webhook

3. Click "Send test data"

4. Check your server logs for confirmation

5. Verify phone number is extracted correctly


STEP 3: Backend Setup (Next.js API Routes)
3a. Create Firebase Admin Config
File: /lib/firebase-admin.js

Purpose: Initialize Firebase Admin SDK

- Handles Firestore operations

- Verifies Firebase tokens

- Manages database writes from webhooks
3b. Create Webhook Endpoint
File: /api/webhooks/shopify.js

Purpose: Receive Shopify webhook events

- Validates webhook signature (security)

- Extracts customer phone number & purchase info

- Formats phone to international format (+91XXXXXXXXXX)

- Writes to Firestore "purchases" collection

- Handles errors gracefully
3c. Create Send OTP Endpoint
File: /api/auth/send-otp.js

Purpose: Send OTP to user's phone

- Accepts: phone number

- Validates: phone format

- Calls: Firebase to send OTP

- Rate limit: Max 5 OTPs per hour per number

- Returns: { success, verificationId, message }
3d. Create Verify OTP Endpoint
File: /api/auth/verify-otp.js

Purpose: Verify OTP and create session

- Accepts: phone number + OTP

- Verifies: OTP with Firebase

- Creates/gets user in Firestore

- Max attempts: 5 tries before timeout

- Returns: { success, uid, token, user }
3e. Create Purchase Verification Endpoint
File: /api/auth/verify-purchase.js

Purpose: Check if phone number has made a purchase

- Accepts: customer phone number (international format)

- Queries: Firestore purchases collection by phone

- Returns: { hasPurchase, purchaseDetails }

- Called by frontend after OTP verification
3f. Create User Profile Endpoint
File: /api/auth/user-profile.js

Purpose: Get user data + purchase status

- Accepts: Firebase UID

- Returns: User data + has_purchased flag + phone number

- Called after Firebase login
3g. Create Logout Endpoint
File: /api/auth/logout.js

Purpose: Destroy user session

- Clears authentication tokens

- Logs out from Firebase

- Handles errors gracefully


STEP 4: Frontend Setup (React Components)
4a. Create Firebase Config File
File: /lib/firebase-client.js

Purpose: Initialize Firebase on frontend

- Set up Firebase Auth with Phone provider

- Set up Firestore client

- Export for use in components

- Include reCAPTCHA verifier
4b. Create Phone Utilities
File: /lib/phone-utils.js

Purpose: Phone number formatting utilities

- formatPhoneNumber(): Convert to international format

- validatePhoneNumber(): Validate phone format

- getCountryCode(): Extract country code

- Handle different country formats
4c. Create Login Component
File: /components/LoginComponent.jsx

Purpose: Mobile number login with OTP

- Phone number input field

- Country code selector

- Phone validation

- Send OTP button

- Show OTPVerificationComponent after OTP sent

- Error handling

- Loading states

- Link to more info
4d. Create OTP Verification Component (NEW)
File: /components/OTPVerificationComponent.jsx

Purpose: OTP entry and verification

- 6-digit OTP input field

- 5-minute countdown timer

- Auto-focus on OTP input

- Resend OTP button (available after 30 sec)

- Verify button

- Error handling with retry logic

- Loading states

- Disable after max attempts (5)
4e. Create Signup Component
File: /components/SignupComponent.jsx

Purpose: Create new Firebase user with phone

- Phone number input

- Country code selector

- Name input (optional)

- OTP verification flow

- Create user in Firebase Auth

- Store user info in Firestore

- Show error messages

- Loading states
4f. Create Protected Video Component
File: /components/ProtectedVideo.jsx

Purpose: Gate Missions 2-10

- Check if Mission 1 (FREE) → Allow access without login

- Check if user logged in (Firebase)

- If not logged in → Show LoginComponent

- If logged in → Check purchase status by phone

- If purchased → Show video player

- If not purchased → Show "Purchase now" message

- Handle loading states and errors
4g. Create Auth Context
File: /context/AuthContext.js

Purpose: Global authentication state

- Track logged-in user and phone number

- Track purchase status

- Provide auth methods: sendOTP, verifyOTP, logout

- Manage OTP state and verification ID

- Sync with Firebase

- Handle token management
4h. Create User Profile Component
File: /components/UserProfile.jsx

Purpose: Show user info and manage account

- Display phone number

- Show purchase status

- Display purchase details (if purchased)

- Logout button

- Account settings


📁 Complete File Structure
project-root/

│

├── .env.local

│   ├── NEXT_PUBLIC_FIREBASE_API_KEY=xxx

│   ├── NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxx

│   ├── NEXT_PUBLIC_FIREBASE_PROJECT_ID=xxx

│   ├── NEXT_PUBLIC_FIREBASE_RECAPTCHA_KEY=xxx

│   ├── FIREBASE_ADMIN_SDK_KEY=xxx

│   ├── SHOPIFY_API_KEY=xxx

│   ├── SHOPIFY_ACCESS_TOKEN=xxx

│   └── SHOPIFY_WEBHOOK_SECRET=xxx

│

├── lib/

│   ├── firebase-client.js (Initialize Firebase with Phone Auth)

│   ├── firebase-admin.js (Initialize Firebase Admin)

│   ├── phone-utils.js (NEW - Phone formatting utilities)

│   └── shopify-utils.js (Shopify API helpers)

│

├── context/

│   └── AuthContext.js (Global auth state - updated for OTP)

│

├── components/

│   ├── LoginComponent.jsx (Updated for mobile input)

│   ├── OTPVerificationComponent.jsx (NEW)

│   ├── SignupComponent.jsx (Updated for phone)

│   ├── ProtectedVideo.jsx

│   └── UserProfile.jsx

│

├── pages/

│   ├── mission/

│   │   └── [id].js (Video player page - with access control)

│   │

│   ├── login.js

│   ├── signup.js

│   └── profile.js

│

├── api/

│   ├── webhooks/

│   │   └── shopify.js (Updated - extract phone from Shopify)

│   │

│   └── auth/

│       ├── send-otp.js (NEW)

│       ├── verify-otp.js (NEW)

│       ├── verify-purchase.js (Updated - use phone instead of email)

│       ├── user-profile.js

│       └── logout.js

│

└── public/

    └── (static assets)


🔄 Data Flow Diagram
┌─────────────────────────────────────────────────────────────────┐

│                        COMPLETE FLOW                            │

└─────────────────────────────────────────────────────────────────┘

STEP 1: PURCHASE ON SHOPIFY

┌──────────────────────────┐

│   Customer buys product  │

│   on Shopify store       │

└────────────┬─────────────┘

             │

             ↓

┌──────────────────────────────────────────┐

│   Shopify triggers webhook event:        │

│   POST to your server with order data    │

│   INCLUDING: customer.phone              │

└────────────┬─────────────────────────────┘

             │

             ↓

┌──────────────────────────────────────────┐

│   /api/webhooks/shopify.js receives:     │

│   - Customer PHONE (+91XXXXXXXXXX)       │

│   - Order ID                             │

│   - Product details                      │

│   - Payment status                       │

└────────────┬─────────────────────────────┘

             │

             ↓

┌──────────────────────────────────────────┐

│   Validate webhook signature (security)  │

│   Verify it's really from Shopify        │

└────────────┬─────────────────────────────┘

             │

             ↓

┌──────────────────────────────────────────┐

│   Format phone to: +91XXXXXXXXXX         │

│   Write to Firestore:                    │

│   /purchases/{purchaseId}                │

│   {                                      │

│     phoneNumber: "+91XXXXXXXXXX",        │

│     orderId: "12345",                    │

│     productName: "Space Explorer",       │

│     purchaseDate: timestamp,             │

│     amount: 500                          │

│   }                                      │

└────────────┬─────────────────────────────┘

STEP 2: USER VISITS WEBSITE

┌──────────────────────────┐

│   User visits            │

│   /mission/2             │

└────────────┬─────────────┘

             │

             ↓

┌──────────────────────────────────────────┐

│   Check: Is mission 1? (FREE)            │

│   YES → Show video (skip login)          │

│   NO → Continue to next check            │

└────────────┬─────────────────────────────┘

             │

             ↓

┌──────────────────────────────────────────┐

│   Check: Is user logged in?              │

│   (Check Firebase Auth token)            │

│   NO → Show LoginComponent               │

│   YES → Continue to next check           │

└────────────┬─────────────────────────────┘

             │

             ↓

┌──────────────────────────────────────────┐

│   User enters mobile number:             │

│   +91XXXXXXXXXX                          │

│   ↓                                      │

│   Call: /api/auth/send-otp               │

│   Firebase sends OTP via SMS             │

└────────────┬─────────────────────────────┘

             │

             ↓

┌──────────────────────────────────────────┐

│   User enters 6-digit OTP                │

│   Show OTPVerificationComponent          │

│   ↓                                      │

│   Call: /api/auth/verify-otp             │

│   Firebase verifies OTP                  │

│   Firebase returns: user UID + token     │

└────────────┬─────────────────────────────┘

             │

             ↓

┌──────────────────────────────────────────┐

│   Call /api/auth/verify-purchase         │

│   Send: user phone number                │

│   Query: Firestore purchases by phone    │

│   Check: Does phone exist in purchases?  │

└────────────┬─────────────────────────────┘

             │

             ↓

┌──────────────────────────────────────────┐

│   RESULT:                                │

│   HAS PURCHASED → Show video player      │

│   NO PURCHASE → Show "Buy now" button    │

└──────────────────────────────────────────┘


🔐 Security Considerations
Phone Authentication Security
// Firebase handles phone authentication securely

// Uses OTP sent via SMS (cannot be intercepted)

// OTP expires after 5 minutes

// Max 5 verification attempts per phone

// Implement rate limiting (max 5 OTPs per hour)
Webhook Security
// Validate that webhook is really from Shopify

// Use HMAC signature verification

// Check: X-Shopify-Hmac-SHA256 header

// Verify phone format matches international standard
Firestore Security Rules
Firestore Rules:

- users collection: Only owner can read/write

- purchases collection: Only backend can write (via webhook), users can read their own

- access_logs: Only backend can write

- Index on purchases.phoneNumber for efficient queries
Environment Variables
Store in .env.local (NEVER commit to git):

- Firebase credentials

- Shopify API keys

- Webhook signing secret

- reCAPTCHA keys
Phone Number Privacy
- Hash phone numbers in logs

- Use HTTPS for all requests

- Rate limit OTP sending (max 5 per hour)

- Rate limit OTP verification (max 5 attempts)

- Auto-delete OTP after 5 minutes

- Don't expose phone in error messages


🔄 Repetitive Implementation Pattern
EVERY TIME you build a component:

Check if Mission 1 → If yes, skip auth (return video immediately)
Check Firebase token → If not logged in, show LoginComponent
Get user phone → From Firebase auth user
Verify purchase → Call /api/auth/verify-purchase with phone number
Grant/Deny access → Show video OR "Purchase required" message
Log access attempt → Write to Firestore access_logs (optional)
Handle errors → Show user-friendly error messages


📊 Firestore Collections Structure
Collection: users
{

  uid: "firebase_user_id",

  phoneNumber: "+91XXXXXXXXXX",           // International format

  countryCode: "91",

  name: "John Doe",                        // Optional

  createdAt: timestamp,

  lastLoginAt: timestamp,

  hasPurchase: false                       // Updated when webhook arrives

}
Collection: purchases
{

  purchaseId: "auto-generated",

  phoneNumber: "+91XXXXXXXXXX",            // Indexed for efficient queries

  orderId: "shopify_order_12345",

  productName: "Space Explorer Workbook",

  productId: "shopify_product_789",

  purchaseDate: timestamp,

  amount: 500,

  currency: "INR",

  paymentStatus: "paid",

  webhookReceivedAt: timestamp

}
Collection: access_logs (Optional)
{

  logId: "auto-generated",

  userId: "firebase_uid",

  userPhone: "+91XXXXXXXXXX",

  missionId: 2,

  accessGranted: true,

  timestamp: timestamp,

  reason: "has_purchase" | "free_mission" | "no_purchase"

}


📝 Environment Variables (.env.local)
# Firebase Configuration (NEXT_PUBLIC = visible in frontend)

NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyD...

NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=yourproject.firebaseapp.com

NEXT_PUBLIC_FIREBASE_PROJECT_ID=yourproject

NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=yourproject.appspot.com

NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789

NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123def456

NEXT_PUBLIC_FIREBASE_RECAPTCHA_KEY=your_recaptcha_public_key

# Firebase Admin SDK (Backend only - SECRET)

FIREBASE_ADMIN_SDK_KEY=eyJhbGciOiJSUzI1NiIsImt5ZCI6IjEyMyJ9...

# Shopify Configuration

SHOPIFY_STORE_NAME=learnwhatmatters

SHOPIFY_API_KEY=your_api_key_here

SHOPIFY_ACCESS_TOKEN=shpat_xxxxxxxxxxxxx

SHOPIFY_WEBHOOK_SECRET=your_webhook_secret_here

# Your domain

NEXT_PUBLIC_APP_URL=https://watch.learnwhatmatters.in


🚀 Implementation Order (6 Phases)
Phase 1: Firebase Setup (30 min)
Create Firebase project
Enable Authentication (Phone provider - NOT Email)
Configure reCAPTCHA
Create Firestore database
Create index on purchases.phoneNumber
Get config & store in .env.local
Phase 2: Shopify Webhook Setup (20 min)
Get Shopify API credentials
Register webhook endpoint
Get webhook signing secret
Test webhook receives phone number
Phase 3: Backend API Routes (1.5 hours)
Create /lib/phone-utils.js
Create /lib/firebase-admin.js
Create /api/webhooks/shopify.js (extract & format phone)
Create /api/auth/send-otp.js
Create /api/auth/verify-otp.js
Create /api/auth/verify-purchase.js (use phone instead of email)
Create /api/auth/user-profile.js
Create /api/auth/logout.js
Phase 4: Frontend Auth Components (2 hours)
Create /lib/firebase-client.js (with Phone Auth)
Create /context/AuthContext.js (with OTP state)
Create LoginComponent.jsx (phone input)
Create OTPVerificationComponent.jsx (NEW)
Create SignupComponent.jsx (phone signup)
Create ProtectedVideo.jsx (phone-based access check)
Create UserProfile.jsx
Phase 5: Integrate into Mission Pages (45 min)
Update /pages/mission/[id].js
Add access control logic using phone
Add ProtectedVideo wrapper
Test mission access flow
Phase 6: Testing & Security (1 hour)
Test webhook with Shopify (verify phone extraction)
Test OTP sending flow
Test OTP verification
Test purchase verification with phone
Test Mission 1 (free access)
Test login persistence
Security audit


🧪 Testing Checklist
Webhook receives phone number from Shopify
Phone formatted correctly to: +91XXXXXXXXXX
Data correctly stored in Firestore purchases collection
OTP sends successfully via Firebase
User can receive and verify OTP
Firebase creates user with phone number
User phone stored in Firestore users collection
Purchase verification works with phone number
Non-purchaser sees "Purchase required" message
Purchaser can watch Missions 2-10
Anyone can watch Mission 1 (free)
Session persists on page refresh
Logout works correctly
Max OTP attempts limit works (max 5)
OTP expires after 5 minutes
Resend OTP button available after 30 seconds


🔗 Useful Links
Firebase Console: https://console.firebase.google.com
Shopify Admin: https://admin.shopify.com
Firebase Phone Auth Docs: https://firebase.google.com/docs/auth/web/phone-auth
Firebase Firestore Docs: https://firebase.google.com/docs/firestore
Shopify Webhook Docs: https://shopify.dev/docs/admin-api/webhooks
Next.js Docs: https://nextjs.org/docs


❓ Common Questions
Q: What phone format should I use? A: Always use international format: +91XXXXXXXXXX (includes country code)

Q: What countries are supported? A: Any country with SMS service. Format: +{countryCode}{phonenumber}

Q: What if OTP doesn't arrive? A: Firebase uses Twilio backend. Check spam folder. User can resend after 30 sec.

Q: Can I change OTP length? A: Firebase OTP is always 6 digits. Cannot be changed.

Q: What if Shopify webhook sends email instead of phone? A: Extract phone from order shipping address, or ask customer to add phone.

Q: What if user loses phone? A: Add account recovery flow. Or admin can reset verification.

Q: How long to implement this? A: 4-6 hours for a developer with Next.js + Firebase experience.

Q: Do I need Firebase hosting? A: No. You can host on Vercel, AWS, or any Node.js host. Firebase is just backend services.

Q: Can I use both email and phone auth? A: Yes, but keep them separate. This system uses phone only.



Last Updated: April 20, 2026 Status: Ready for implementation with Mobile OTP Complexity Level: Medium Estimated Time: 4-6 hours Authentication Method: Mobile Number + OTP (Firebase Phone Auth)

