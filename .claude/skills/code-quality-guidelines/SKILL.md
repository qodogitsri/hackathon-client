---
name: code-quality-guidelines
description: Use when editing this vanilla JavaScript client repo to keep changes minimal, accessible, and API-aware.
---

# Code Quality Guidelines

## We Expect

- Keep JavaScript small, readable, and organized around clear UI actions.
- Keep API paths and response assumptions easy to find and update.
- Show useful loading, empty, and error states when API calls fail.
- Preserve accessible labels, semantic HTML, and keyboard-friendly controls.
- Keep CSS responsive without adding build tooling.

## We Do Not Expect

- Do not add a frontend framework, bundler, or dependency without a direct requirement.
- Do not duplicate API URLs or route strings across unrelated files.
- Do not hide API failures from the user.
- Do not create large visual redesigns for narrow behavior changes.
