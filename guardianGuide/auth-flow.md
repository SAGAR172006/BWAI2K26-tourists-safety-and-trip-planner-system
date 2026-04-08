— Authentication Flow

## Overview
Every user MUST have: verified email + verified phone + first name + last name.
No exceptions. `middleware.ts` enforces this before any `/app/*` route is accessible.

## Step-by-Step: Google OAuth Path

```
SCREEN 1: /auth/login
  → User clicks "Continue with Google"
  → Supabase Auth triggers Google OAuth
  → Google returns: email (verified), google_id, display_name
  → Supabase creates auth.users entry
  → Our trigger creates public.users entry with email_verified=true

SCREEN 2: /auth/complete-profile
  → Fields shown: First Name, Last Name (pre-filled from Google if available)
  → Phone input: country code flag dropdown + number
  → User submits → POST /api/auth/phone-otp { phone: "+91xxxxxxxxxx" }

SCREEN 3: /auth/verify-otp
  → 6-box OTP input
  → User enters code → POST /api/auth/verify-otp { phone, otp }
  → On success: public.users SET phone_verified=true, phone=number
  → Redirect → /app/home
```

## Step-by-Step: Phone Number Path

```
SCREEN 1: /auth/login
  → User selects "Use Phone Number"
  → Country code picker (searchable dropdown with flags)
  → Phone number input
  → POST /api/auth/phone-otp → OTP sent

SCREEN 2: /auth/verify-otp
  → OTP verified → phone_verified=true

SCREEN 3: /auth/complete-profile
  → Fields: First Name, Last Name, Email
  → User submits email → Supabase sends verification email

SCREEN 4: /auth/verify-email
  → "Check your inbox" screen
  → User clicks link in email → email_verified=true
  → Redirect → /app/home
```

## Middleware Logic (`middleware.ts`)
```typescript
// Runs on every /app/* request
const session = await supabase.auth.getSession()
if (!session) redirect('/auth/login')

const { data: user } = await supabase
  .from('users')
  .select('phone_verified, email_verified, first_name')
  .eq('id', session.user.id)
  .single()

if (!user.phone_verified || !user.email_verified || !user.first_name) {
  redirect('/auth/complete-profile')
}
```

---