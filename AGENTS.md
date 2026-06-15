# Agent Guidelines

These guidelines apply to automated coding agents working in this repository.

## Client Conventions

- Keep the app usable as static files served by a basic HTTP server.
- Prefer explicit DOM queries and event handlers over clever generic wiring.
- Keep user-facing text short and action-oriented.
- Preserve the current file layout unless a change genuinely needs another file.
- Avoid storing durable state in the browser unless the task asks for it.

## Dependencies

- Do not add npm, package manifests, or build steps for simple UI changes.
- Prefer browser-native APIs for fetch, rendering, and form handling.
- Keep external service URLs centralized and easy to change.

## Verification

- Serve the client locally and verify the changed workflow in a browser when UI behavior changes.
- Check the browser console for failed requests and JavaScript errors.
- Confirm the client still handles API offline or error states gracefully.

## Git Hygiene

- Keep commits focused on one intent.
- Do not commit generated assets, local server logs, or machine-specific files.
- Leave unrelated branches and user changes untouched.
