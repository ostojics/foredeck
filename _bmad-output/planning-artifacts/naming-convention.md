# Naming Convention for Epics, Stories, and Tasks

Epics, stories, and tasks are identified for traceability in PRs, branch names, and comments:

- **Epic:** E-{short-name}-{seq} (e.g., E-onboarding-01, E-setup-02)
- **Story:** S-{epic-short-name}-{seq} (e.g., S-onboarding-01, S-setup-03)
- **Task:** T-{story-short-name}-{seq} (e.g., T-onboarding-01-01, T-setup-03-02)

Reference the relevant identifier in all workflow artifacts and code changes.

**Marking Completion:**
When a story or task is completed, append `(done)` to its ID in the PR description (e.g., `S-onboarding-01 (done)`, `T-onboarding-01-01 (done)`). This provides clear traceability of completed work.
