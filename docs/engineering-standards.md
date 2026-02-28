# Engineering Standards

## Purpose
This document defines the minimum quality bar for changes in Kelajak Merosi.

## Definition Of Done
A task is done only when all are true:
- Navigation/state behavior is deterministic and deep-linkable.
- Naming and file placement follow the conventions below.
- Accessibility checks pass for keyboard and focus behavior.
- Error handling is explicit and observable; no silent fallbacks for critical paths.
- API contracts are validated at boundaries.
- Relevant tests are updated or added.
- Docs that describe changed behavior are updated.

## Naming Conventions
- Route screens: `*Page.tsx`
- Reusable view units: `*Card`, `*Panel`, `*Item`, `*Row`
- Providers: `*Provider.tsx`
- Service clients: `<domain>.service.ts`
- Server controllers: `<domain>.controller.js`
- Server models/data modules: `<domain>.model.js`

## Foldering Rules
- `client/src/pages`: route-level pages only.
- `client/src/components/ui`: reusable primitives only.
- `client/src/components/features`: domain-specific composed components.
- `client/src/components/layout`: shell/navigation/top-level layout components.
- `client/src/services`: API and persistence adapters only.
- `shared/contracts`: runtime request/response schemas used by client and server.
- `server/src/controllers`: HTTP adapters only; avoid data access logic in controllers.
- `server/src/models`: data access and data mapping logic.

## UI Ownership
- Every reusable UI component owns its local CSS module.
- Global CSS is limited to reset, tokens, layout primitives, and utility classes.
- Do not add new reusable component styles to a shared global module.

## API Contract Standards
- Success envelope: `{ data, meta? }`
- Error envelope: `{ error: { code, message, requestId, details? } }`
- Validate inbound request payloads at server route/controller boundaries.
- Validate critical client responses before using payloads.

## Error Handling Standards
- Do not swallow backend errors in user-critical pages.
- Include `requestId` in server error responses and logs.
- Distinguish network errors from validation/auth errors in UI messaging.

## Observability Standards
- Structured logs must include request id and route.
- Authenticated requests should include user id when available.
- Security-relevant events (auth failures, forbidden access) should be warn-level or above.

## Testing Baseline
- Route-level flow tests for dashboard, subjects, topic, profile, and admin paths.
- Contract tests for success/error envelope parsing.
- Regression checks for auth expiry handling.
