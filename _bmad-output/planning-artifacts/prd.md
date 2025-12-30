# Product Requirements Document (PRD)

**Project:** Foredeck  
**Date:** December 30, 2025

## 1. Purpose & Scope

Build an MVP SaaS for SMBs to manage vacation/time-off, focusing on delightful UX, simple flows, and real-time team visibility. Avoid overbuilding; validate with real users before expanding.

## 2. Problems to Solve

- Manual, error-prone time-off tracking (spreadsheets, emails)
- Lack of visibility into team absences and capacity
- Slow, confusing approval processes
- Overly complex or expensive HR tools for small teams
- Poor onboarding and hidden costs

## 3. MVP Features (from Brainstorming & Research)

### Core

- User roles and permissions (employee, manager)
- Employees:
  - Real-time visibility into schedules and remaining days
  - Simple vacation request/management
  - Email notifications for approvals/rejections (with reason)
  - Playful, encouraging copy and micro-interactions (e.g., confetti on approval)
- Managers:
  - Approve/reject requests with reasons
  - Team capacity preview and threshold alerts
- Dashboards and analytics (per Untitled UI Figma system)
- Auth flows for self-onboarding and sign-in
  - Onboarding form: company name, URL, full name, email, password
  - First onboarded user is manager; can invite team and assign roles
- Seamless onboarding from spreadsheets
- Multi-tenant support (tenant_id in tables; future: Postgres RLS)
- Transparent, per-user pricing

### Technical

- Modern monorepo (Turborepo: NestJS backend, React/Vite frontend)
- Shared Zod schemas and TypeScript types for validation and contracts
- Accessible, mobile-friendly UI (BEM SCSS, Figma design system)
- Automated tests for critical flows

## 4. Non-Goals (Post-MVP)

- Plug-and-play integrations (Google/Microsoft calendar, payroll)
- Burnout alerts
- Advanced analytics and team capacity views
- Full HRIS features

## 5. User Stories

- As an employee, I can request time off in seconds and see my remaining days.
- As a manager, I can approve/reject requests and see team capacity at a glance.
- As an admin, I can onboard my company and invite my team in minutes.
- As a user, I enjoy a playful, friendly experience (emojis, confetti, positive copy).

## 6. Success Criteria

- MVP launched with all core features above
- User onboarding from spreadsheet in <10 minutes
- 90%+ positive feedback on UX in pilot user testing
- <1 support ticket per 10 users in first month
- No hidden fees; pricing is clear and public

## 7. Risks & Mitigations

- Risk: Overbuilding analytics or HR features → Mitigation: Strict MVP scope, validate with users
- Risk: Resistance to switching from spreadsheets → Mitigation: Frictionless onboarding, clear value messaging
