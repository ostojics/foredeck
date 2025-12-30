# Foredeck Onboarding User Flows

This document details the user flows for the onboarding process after a customer purchases a Foredeck product license.

---

## 1. Onboarding Email → Form

1. User receives onboarding email after purchase.
2. User clicks “Begin Onboarding” link/button in the email.
3. User is taken to the onboarding form in the web app.

---

## 2. Onboarding Form Submission

1. User fills out the following fields:
   - Company Name (required)
   - Company URL (optional)
   - Full Name (required)
   - Email (required)
   - Password (required)
   - Confirm Password (required)
2. User clicks “Create Account”.
3. System validates fields client-side (react-hook-form + Zod):
   - If errors: Inline error messages are shown under the relevant fields.
   - If valid: Form is submitted to the backend.
4. Submit button shows loading state (“Creating account…”).
5. Backend processes the request:
   - If success: User is shown a success page.
   - If failure: Toast notification appears with error message and support contact.

---

## 3. Success Page → Dashboard

1. User sees a confirmation message (“Your account is ready.”).
2. After 3 seconds, user is automatically redirected to the dashboard.
3. If redirect fails, user can click a link to go to the dashboard manually.

---

## 4. First Dashboard Visit (Empty State)

1. User lands on the dashboard for the first time.
2. Empty state message: “Welcome! Invite your team to get started.”
3. User can click “Invite Team Members” to proceed.

---

## Notes

- Support email is always visible for help.
- All error and success states are clear and actionable.
- No progress indicator or password strength meter.
- Button is always enabled; validation is handled by react-hook-form + Zod.
