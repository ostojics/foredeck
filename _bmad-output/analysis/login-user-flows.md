# Foredeck Login User Flows

This document details the user flows for the login process in the Foredeck application, covering both frontend and backend interactions as described in the authentication epic.

---

## 1. Login Page Visit

1. User navigates to `/login` route in the web app.
2. Login form is displayed, containing:
   - Email input (required)
   - Password input (required)
   - Submit button ("Log In")

---

## 2. Login Form Submission

1. User enters email and password.
2. User clicks "Log In" button.
3. System validates fields client-side (react-hook-form + Zod):
   - If errors: Inline error messages are shown under the relevant fields.
   - If valid: Form is submitted to the backend.
4. Submit button shows loading state ("Logging in…").
5. Backend processes the request:
   - If success: User is redirected to the dashboard.
   - If failure: Browser alert is shown with generic error message (temporary solution).

---

## 3. Successful Login

1. User is redirected to the dashboard after successful authentication.
2. Session is established via HttpOnly JWT cookie.

---

## 4. Failed Login

1. If credentials are invalid or an error occurs:
   - Browser alert displays a generic error message (e.g., "Login failed. Please check your credentials and try again.").
   - User remains on the login page.

---

## Notes

- All validation is handled by react-hook-form + Zod using the shared contract schema.
- No password reset or registration links are present in MVP login (future stories).
- Accessibility: Proper labels, tab order, ARIA attributes.
- Button is always enabled; validation is handled on submit.
- All error messages are generic to prevent enumeration attacks.
