# Security Backlog

Items identified during security review that should be addressed eventually.
Listed in priority order.

---

## Completed (2025-12-26)

- [x] Rate limiting on signup (5 req/min/IP)
- [x] Rate limiting on login (10 attempts/15min/email)
- [x] Email normalization (lowercase + trim)

---

## High Priority

### 1. Progress Data Validation (Zod)
**File:** `apps/web/src/app/api/progress/[appId]/route.ts`

Currently accepts any JSON blob. Should validate:
- Required fields per game (coins, unlockedVehicles, etc.)
- Max values for numeric fields (prevent injecting 999999 coins)
- Type checking for all fields

```typescript
// Example: apps/web/src/lib/progress-schemas.ts
import { z } from "zod";

export const hillClimbProgressSchema = z.object({
  coins: z.number().min(0).max(10_000_000),
  xp: z.number().min(0),
  unlockedVehicles: z.array(z.string()),
  unlockedStages: z.array(z.string()),
  // etc.
});
```

### 2. Dynamic localStorage Cleanup
**File:** `apps/web/src/lib/auth-client.ts`

Current hardcoded keys will miss new games:
```typescript
localStorage.removeItem("hill-climb-storage");
localStorage.removeItem("monster-truck-save");
```

Should iterate and clear all game-related keys:
```typescript
for (const key of Object.keys(localStorage)) {
  if (key.endsWith("-storage") || key.endsWith("-save")) {
    localStorage.removeItem(key);
  }
}
```

### 3. Server Timestamps Only
**File:** `apps/web/src/lib/progress-merge.ts`

Client-provided timestamps can be manipulated (set clock forward).
Should use server time only for merge decisions:
```typescript
// Instead of:
mergeProgress(localData, serverData, localTimestamp, serverTimestamp)

// Use:
mergeProgress(localData, serverData, serverData?.updatedAt)
// Always trust server time
```

---

## Medium Priority

### 4. Stronger Password Requirements
**File:** `apps/web/src/app/api/auth/signup/route.ts`

Current: 6 characters minimum
Recommended: 8 characters minimum

For a kids' game, don't overcomplicate (no special chars requirement).

### 5. Remove Dangerous deepMergeProgress
**File:** `apps/web/src/lib/progress-merge.ts`

The `deepMergeProgress` function is exploitable:
- `Math.max()` on numbers = infinite coins exploit
- `||` on booleans = permanent unlocks

Either:
- Delete the function entirely
- Add huge warning comments
- Make it require explicit opt-in per field

---

## Low Priority (Future)

### 6. Email Verification
New users can sign up with any email without verification.
Would require:
- Send verification email on signup
- Block login until verified
- "Resend verification" flow

Not critical for a kids' game platform but good practice.

### 7. Audit Logging
Currently no logging of:
- Failed login attempts
- Account creation
- Suspicious activity (rapid progress saves)

Would help with:
- Detecting abuse
- Debugging user issues
- Compliance (if ever needed)

### 8. Account Lockout
After X failed attempts, lock account temporarily.
Currently rate-limited by email, but could add:
- Account lockout after 20 failed attempts
- Email notification on lockout
- Unlock after 1 hour or manual reset

---

## Notes

- In-memory rate limiting resets on server restart (acceptable for low-traffic kids' game)
- For production with high traffic, consider Upstash Redis
- Transaction log table exists but is never used - intended for anti-cheat but not implemented
