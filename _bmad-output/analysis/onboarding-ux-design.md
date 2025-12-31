# Foredeck Onboarding UX Design

## Overview

This document outlines the UX design and user flows for the initial onboarding process after a customer purchases a Foredeck product license.

---

## 1. Onboarding Email

- **Subject:** Welcome to Foredeck – Your Account Setup
- **Body:**
  - Professional, friendly greeting and purchase confirmation.
  - “Begin Onboarding” button.
  - License key (if needed) and onboarding link.
  - Support: “If you need help, contact support@foredeck.com”
  - Concise, welcoming copy.

---

## 2. Onboarding Form (Web)

### Layout

- Centered card-style form with Foredeck branding.
- Sectioned fields:
  - “Company Info”
  - “Account Info”

### Fields

#### Company Info

- Company Name (required)
- Company URL (optional, placeholder: “https://yourcompany.com”)

#### Account Info

- Full Name (required)
- Email (required, email format)
- Password (required, min 8 chars, show/hide toggle)
- Confirm Password (required, must match)

### UX Details

- Validation handled by react-hook-form + Zod; errors shown inline under fields.
- Submit button: “Create Account” (always enabled, shows loading state on submit).
- Accessibility: Proper labels, tab order, ARIA attributes.

---

## 3. Submission Handling

- **On Submit:**
  - Show loading spinner on button (“Creating account…”)
  - POST request to backend with form data.

- **On Success:**
  - Success page:
    - “Your account is ready.”
    - Subtle visual confirmation (e.g., checkmark, light animation).
    - “You’ll be redirected to your dashboard shortly.”
    - Auto-redirect after 3 seconds.
    - Link to dashboard if redirect fails.
    - Support: “Need help? Contact support@foredeck.com”

- **On Failure:**
  - Toast notification at top-right:
    - “There was a problem: [error message]”
    - “If you need assistance, contact support@foredeck.com”
    - Toast auto-dismisses after 5 seconds, can be closed manually.

---

## 4. Empty State (First Dashboard Visit)

- Clear copy: “Welcome! Invite your team to get started.”
- Button: “Invite Team Members”
- Optional subtle illustration.

---

## 5. Visual/Interaction Notes

- Use theme tokens for colors, rem units for sizing.
- Copy is clear, concise, and welcoming.
- Animations are subtle and professional.
- Responsive, single-column layout for mobile.

---

## 6. Error Handling

- All errors (validation, server) are mapped to fields or shown as toasts.
- Server errors: “Something went wrong. Please try again or contact support@foredeck.com.”

---

## 7. Support

- Support email is visible in onboarding email, form footer, and all error/success states.

---

# User Flows

## 1. Onboarding Email → Form

1. User receives onboarding email after purchase.
2. User clicks “Begin Onboarding” link/button.
3. User is taken to the onboarding form.

## 2. Onboarding Form Submission

1. User fills out company and account info fields.
2. User clicks “Create Account”.
3. System validates fields (client-side with react-hook-form + Zod).
   - If errors: Inline error messages under fields.
   - If valid: Form submits.
4. System shows loading state on button.
5. Backend processes request.
   - If success: User is shown success page.
   - If failure: Toast notification with error message.

## 3. Success Page → Dashboard

1. User sees success confirmation (“Your account is ready.”).
2. After 3 seconds, user is automatically redirected to dashboard.
3. If redirect fails, user can click a link to go to dashboard manually.

## 4. First Dashboard Visit (Empty State)

1. User lands on dashboard for the first time.
2. Empty state message: “Welcome! Invite your team to get started.”
3. User can click “Invite Team Members” to proceed.

---

## Notes

- Support email is always visible for help.
- All error and success states are clear and actionable.
- No progress indicator or password strength meter.
- Button is always enabled; validation is handled by react-hook-form + Zod.
