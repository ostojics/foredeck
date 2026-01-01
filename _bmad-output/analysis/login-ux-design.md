# Foredeck Login UX Design

## Overview

This document outlines the UX design for the login process in the Foredeck web application, following the authentication epic and established frontend patterns.

---

## 1. Login Page Layout

- **Centered card-style form** with Foredeck branding (logo, color tokens).
- **Single-column layout** for mobile responsiveness.
- **Form fields:**
  - Email (required, type="email", autoFocus)
  - Password (required, type="password")
- **Submit button:**
  - Label: "Log In"
  - Always enabled; shows loading state on submit ("Logging in…").

---

## 2. Validation & Error Handling

- **Client-side validation:**
  - Uses react-hook-form + Zod contract schema.
  - Inline error messages under each field on validation failure.
- **On submit:**
  - If backend error: Show browser alert with generic error message (temporary solution).
- **Accessibility:**
  - Proper labels, tab order, ARIA attributes.
  - Password field supports show/hide toggle for visibility.

---

## 3. Visual & Interaction Details

- **Branding:**
  - Use theme tokens for all colors (see theme-and-colors.md).
- **Spacing & Sizing:**
  - Use rem units for all sizing.
  - Card has generous padding and margin for focus.
- **Button:**
  - Full width, primary color, rounded corners.
  - Shows spinner/loading state on submit.
- **Form:**
  - Keyboard accessible (tab order, enter to submit).
  - Error states are visually distinct (red text, ARIA live region).

---

## 4. Success & Failure States

- **Success:**
  - On successful login, user is redirected to dashboard.
- **Failure:**
  - On error, browser alert displays: "Login failed. Please check your credentials and try again."

---

## 5. Security & Privacy

- **No password autofill suggestions** (autocomplete="off" on password field).
- **No enumeration:** All error messages are generic.
- **Session:** JWT is set as HttpOnly cookie (handled by backend).

---

## 6. Support

- Support email is visible in the form footer: "Need help? Contact support@foredeck.com"

---

## 7. Future Enhancements (Not in MVP)

- Add password reset and registration links.
- Replace browser alert with toast notifications.
- Add password strength meter.
- Social login options.
