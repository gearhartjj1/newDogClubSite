# Login System Security Review

**Review Date**: May 14, 2026

## Summary

The current login system has several critical security vulnerabilities that need to be addressed before using in production. This document outlines identified issues and recommended improvements.

---

## 🚨 Critical Security Issues

### 1. Plaintext Password Storage
- **Issue**: Passwords are stored and compared as plain text in the database
- **Risk**: Anyone with database access can read all passwords; violates GDPR/privacy regulations
- **Fix**: Use bcrypt (or Argon2) to hash passwords before storing
- **Priority**: CRITICAL
- **Files**: `server/routes/signin.ts`

### 2. No Authentication Token/Session Management
- **Issue**: User data is stored only in React context (client-side)
- **Risk**: No server-side session validation on subsequent requests; vulnerable to XSS attacks and impersonation
- **Fix**: Implement JWT tokens or session-based authentication
- **Priority**: CRITICAL
- **Files**: `src/context/UserDataContext.tsx`, `src/services/api.ts`, `server/routes/signin.ts`

### 3. Missing HTTPS Enforcement
- **Issue**: Credentials are sent over HTTP (in dev) without encryption
- **Risk**: Credentials vulnerable to man-in-the-middle (MITM) attacks
- **Fix**: Enforce HTTPS in production; use secure/httpOnly cookies
- **Priority**: CRITICAL
- **Files**: `server/index.ts`, environment configuration

### 4. No CSRF Protection
- **Issue**: No CSRF tokens to prevent cross-site request forgery
- **Risk**: Attackers can submit login requests from malicious sites
- **Fix**: Implement CSRF token middleware
- **Priority**: HIGH
- **Files**: `server/index.ts`, `src/services/api.ts`

### 5. No Rate Limiting
- **Issue**: Unlimited login attempts allow brute force attacks
- **Risk**: Attackers can try thousands of password combinations
- **Fix**: Implement rate limiting on `POST /api/signin` (e.g., 5 attempts per 15 minutes)
- **Priority**: HIGH
- **Files**: `server/routes/signin.ts`

### 6. Entire User Object Returned in Response
- **Issue**: All sensitive fields are exposed to the client after login
- **Risk**: Database column names and structure exposed; unnecessary data leakage
- **Fix**: Return only necessary fields: `{ id, username, email }` (no Phone, Family, etc.)
- **Priority**: HIGH
- **Files**: `server/routes/signin.ts`, `src/pages/Login.tsx`

### 7. Logging Sensitive Data
- **Issue**: Console logs contain full user objects and database queries
- **Risk**: Credentials and sensitive data recorded in logs; visible in development tools
- **Fix**: Remove sensitive data from logs; log to secure file instead with appropriate filtering
- **Priority**: HIGH
- **Files**: `server/routes/signin.ts` (multiple console.log statements)

---

## ⚠️ Other Important Issues

### 8. No Password Strength Requirements
- **Issue**: No minimum length, complexity, or character requirements
- **Risk**: Users can set weak passwords (e.g., "123", "test")
- **Fix**: Enforce password policy: minimum 12 characters, mixed case, numbers, symbols
- **Priority**: MEDIUM

### 9. No Logout Mechanism
- **Issue**: Users can't securely logout
- **Risk**: Session doesn't end; token remains valid
- **Fix**: Implement logout endpoint that invalidates tokens/sessions
- **Priority**: MEDIUM
- **Files**: New route needed: `server/routes/logout.ts`

### 10. Frontend State Loss on Refresh
- **Issue**: User data disappears on page reload since it's only in React context
- **Risk**: Poor UX; users forced to re-login after refresh
- **Fix**: Store auth token in localStorage/sessionStorage, validate token on app load
- **Priority**: MEDIUM
- **Files**: `src/App.tsx`, `src/context/UserDataContext.tsx`

### 11. No Password Change/Reset Flow
- **Issue**: Users can't update their password; no "forgot password" functionality
- **Risk**: Users stuck with potentially compromised passwords
- **Fix**: Implement password change endpoint and email-based password reset
- **Priority**: MEDIUM

### 12. Unusual Database Schema
- **Issue**: Using `LastName` as username seems unconventional
- **Risk**: Confusion between usernames and actual names; potential for duplicates
- **Fix**: Consider adding a dedicated `Username` column to Teacher table
- **Priority**: LOW
- **Files**: Database schema, `server/routes/signin.ts`

---

## 💡 Recommended Implementation Strategy

### Phase 1: Critical (Do First)
1. **Implement password hashing** - Use bcrypt to hash all passwords
2. **Add JWT token authentication** - Return JWT on successful login
3. **Validate tokens on protected routes** - Middleware to check token validity
4. **Remove sensitive data from responses** - Only return necessary user info

### Phase 2: Important (Do Soon)
5. **Add rate limiting** - Prevent brute force attacks
6. **Implement HTTPS/secure cookies** - Secure token transmission
7. **Add CSRF protection** - Prevent cross-site attacks
8. **Remove sensitive logs** - Clean up console.log statements

### Phase 3: Good to Have
9. **Add logout endpoint** - Properly invalidate sessions
10. **Persist auth tokens** - localStorage/sessionStorage recovery on refresh
11. **Add password strength validation** - Client + server-side validation
12. **Implement password reset flow** - Email-based recovery

---

## Technical Stack Recommendations

### Password Hashing
```bash
npm install bcrypt
npm install --save-dev @types/bcrypt
```

### JWT Authentication
```bash
npm install jsonwebtoken
npm install --save-dev @types/jsonwebtoken
```

### Rate Limiting
```bash
npm install express-rate-limit
```

### CSRF Protection
```bash
npm install csrf
```

### Additional Security
```bash
npm install helmet  # Adds various HTTP headers for security
```

---

## Code Changes Overview

### Files to Modify
- `server/routes/signin.ts` - Add hashing, JWT tokens, rate limiting
- `src/services/api.ts` - Add token to request headers
- `src/context/UserDataContext.tsx` - Store and manage auth tokens
- `src/pages/Login.tsx` - Handle token persistence
- `server/index.ts` - Add security middleware (CORS, HTTPS, rate limiting)

### Files to Create
- `server/middleware/auth.ts` - JWT verification middleware
- `server/middleware/rateLimit.ts` - Rate limiting configuration
- `server/routes/logout.ts` - Logout endpoint

---

## Implementation Notes

1. **Database migration needed** - Hash all existing passwords or reset them
2. **Environment variables** - Store JWT secret securely in `.env`
3. **Token expiration** - Set reasonable expiration times (15 min access, 7 day refresh)
4. **CORS updated** - Allow credentials when using cookies
5. **Frontend configuration** - Update API calls to include auth headers/cookies

---

## Compliance Considerations

- **GDPR**: Plaintext password storage violates user data protection requirements
- **PCI DSS**: If handling payments, password security is mandatory
- **Best Practices**: Follow OWASP recommendations for authentication

---

## Questions to Address

1. Should we use JWT tokens or session-based authentication?
2. Will token be stored in localStorage or httpOnly cookies?
3. What should token expiration times be?
4. Should we implement "Remember me" functionality?
5. Is there a password reset email system available?

---

## Testing Checklist

After implementation, verify:
- [ ] Plaintext passwords are no longer in database
- [ ] Tokens are validated on every protected route
- [ ] Rate limiting blocks brute force attempts
- [ ] CSRF tokens prevent unauthorized requests
- [ ] Sensitive data not in API responses
- [ ] User session persists on page refresh
- [ ] Logout properly invalidates tokens
- [ ] Password changes are hashed correctly
- [ ] Logs don't contain sensitive information

