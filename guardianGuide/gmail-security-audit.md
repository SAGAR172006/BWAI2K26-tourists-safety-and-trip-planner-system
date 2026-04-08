— Gmail API Security

## Credential Safety Checklist

### OAuth Setup (Google Cloud Console)
- [ ] Create dedicated GCP project for GuardianGuide (not shared)
- [ ] OAuth consent screen: only request `gmail.readonly` scope
- [ ] Authorized redirect URIs: only production domain + localhost (dev only)
- [ ] Remove localhost redirect URI before production launch

### Token Storage
- [ ] Access token: stored in Supabase `users.gmail_token` column (encrypted at rest)
- [ ] Refresh token: stored same column, never in cookies or localStorage
- [ ] Token exchange happens server-side only (Next.js API route `/api/auth/google`)
- [ ] Token NEVER passed to FastAPI backend directly — only email parsing results

### What We Access (And What We Don't)
```
WE ACCESS:
  ✅ Email subject lines (to identify booking emails)
  ✅ Email body text (to extract booking details)
  ✅ Email date (to match trip dates)

WE NEVER ACCESS:
  ❌ Contacts
  ❌ Sent emails
  ❌ Calendar
  ❌ Any email unrelated to travel bookings
```

### Parsing Safety
- All email parsing happens in `booking_parser.py` — no raw email content sent to LLM
- Regex patterns extract: booking ref, dates, amounts only
- Extracted data is structured (not raw email text) before any AI processing

### User Control
- Users can disconnect Gmail from User Profile screen at any time
- Disconnecting revokes token in Supabase and calls Google token revocation endpoint
- After revocation, no further Gmail access until user re-authorizes

---