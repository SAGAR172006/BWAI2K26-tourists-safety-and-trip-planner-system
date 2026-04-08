— Security & Privacy Requirements

## ✅ Pre-Launch Security Checklist

### Secrets Management
- [ ] All API keys in `.env` files only. Never in source code.
- [ ] `.env` files in `.gitignore`. Verified with `git status`.
- [ ] `.env.example` has placeholder values only (no real keys).
- [ ] Production keys in Vercel environment variables dashboard.
- [ ] `SUPABASE_SERVICE_KEY` only used in backend. Never in frontend bundle.
- [ ] `next.config.ts`: only `NEXT_PUBLIC_*` vars exposed to browser.

### Authentication
- [ ] Supabase RLS enabled on ALL tables (verify in Supabase dashboard).
- [ ] Every table has `auth.uid() = user_id` policy.
- [ ] Middleware `middleware.ts` protects all `/app/*` routes.
- [ ] JWT validated on every FastAPI request via `auth_guard.py`.
- [ ] Phone OTP expiry: 10 minutes maximum.
- [ ] Email verification link expiry: 24 hours maximum.

### PII Protection
- [ ] `pii_redactor.py` runs on ALL user input before LLM calls.
- [ ] Logs do not contain: names, emails, phone numbers, coordinates.
- [ ] LangSmith traces: PII redacted before logging (check `langsmith_tracer.py`).
- [ ] Supabase vault column: encrypted at rest (Supabase handles this).

### API Security
- [ ] Rate limiter active for: `/api/planner` (2/min), `/api/translate` (2/min).
- [ ] Rate limiter active for: all endpoints (10/min general limit).
- [ ] Redis rate limit keys include user_id (not just IP) to prevent bypass.
- [ ] `prompt_injection_guard.py` wraps all user input in `[USER_INPUT]` delimiters.
- [ ] System message is in `role: "system"` — user cannot override it.

### Gmail API Specifically
- [ ] Only `gmail.readonly` scope requested. Never write access.
- [ ] Gmail OAuth token stored in Supabase, not in localStorage.
- [ ] Token never sent to LLM or logged.
- [ ] Gmail sync only runs for authenticated user's own token.
- [ ] Token refresh handled automatically by Google OAuth library.
- [ ] Users can revoke Gmail access from User Profile screen.

### Frontend
- [ ] No sensitive data in localStorage or sessionStorage.
- [ ] Content Security Policy (CSP) headers set in `next.config.ts`.
- [ ] HTTPS enforced (Vercel handles this automatically).
- [ ] No API keys in frontend bundle (check with `next build` output).

---