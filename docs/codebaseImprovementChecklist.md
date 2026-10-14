# Codebase Improvement Checklist

> Temporary working checklist for the codebase improvement phase. The engineering standards document remains the project-wide source of truth. This file tracks execution only and should be removed or archived when the work is complete.

## Working Agreement

- [x] Work on a dedicated improvement branch.
- [ ] Keep feature behavior stable unless a change is explicitly planned.
- [ ] Make one focused change at a time.
- [ ] Use atomic commits only after user approval.
- [ ] Never include unrelated files such as local editor settings.
- [ ] Update the engineering standards document when a project-wide rule changes.
- [ ] Record open questions and deferred improvements instead of silently expanding scope.

## Phase 1: Baseline Audit

- [x] Record the current branch, clean/dirty state, and recent commits.
- [x] Inventory routes, layouts, providers, features, entities, shared modules, MSW mocks, and public assets.
- [x] Map the dependency direction between `app`, `features`, `entities`, `shared`, and `mocks`.
- [x] Identify duplicated components, utilities, models, API logic, and styling patterns.
- [x] Review package dependencies.
- [ ] Remove unused or duplicated dependencies after bundle and import analysis.
- [x] Run `npm run lint`.
- [x] Run `npm run lint:naming`.
- [x] Run `npm run typecheck`.
- [x] Run `npm run build`.
- [x] Run all existing tests (no test script exists yet).
- [x] Create a findings list grouped by severity and ownership boundary.
- [ ] Create a short list of changes that are safe to defer.

### Baseline Findings

- **High, shared API boundary:** JSON arrays, `null`, and scalar request bodies could reach mock handlers and become unhandled `500` responses. The MSW parser now rejects non-object JSON with `400 BAD_REQUEST`.
- **High, shared API boundary:** The browser client accepted any successful response containing `data`, `error`, and `meta`, even when the error shape or request metadata was malformed. The envelope validator now checks the error code, message, details, and request ID.
- **Resolved, mock API boundary:** Application calls use the fixed `/api` boundary and are intercepted by MSW; no public backend origin or runtime API URL is required.
- **Medium, resilience:** The project has no test runner or browser test suite yet, so API boundary and responsive behavior currently rely on lint, typecheck, build, and manual verification.
- **Medium, architecture:** `HomeScreen` owns authentication gating, responsive scroll listeners, layout composition, data states, and footer behavior. It is the first large feature component to split after the API boundary work.
- **Low, navigation:** Several internal feature links still use raw anchors instead of `next/link`, which prevents client-side navigation and should be addressed during the home feature refactor.

## Phase 2: Rules and Enforcement

- [ ] Confirm file naming conventions for routes, components, hooks, utilities, API modules, stores, models, and tests.
- [ ] Confirm function, event handler, boolean, type, and model naming conventions.
- [ ] Enforce naming conventions through ESLint rather than documentation alone.
- [ ] Enforce import boundaries and dependency direction.
- [ ] Enforce supported Tailwind utility classes before using arbitrary values.
- [ ] Add or refine checks for unsafe `any`, unsafe URLs, raw browser storage, and direct component HTTP calls.
- [ ] Verify Husky or equivalent hooks run the intended checks.
- [ ] Add CI parity for local quality checks if CI exists.
- [ ] Update `AGENTS.md` and `docs/engineering-standards.md` only when the rules genuinely change.

## Phase 3: Architecture Foundation

- [ ] Confirm Next.js App Router ownership of route files and route-level UI states.
- [ ] Keep reusable workflow code inside the owning feature.
- [ ] Move genuinely cross-feature code into `shared` only after checking ownership.
- [ ] Place shared domain models in the correct entity model folder.
- [ ] Keep endpoint-specific DTOs beside their feature API modules.
- [ ] Separate transport DTOs, domain models, and view models where their responsibilities differ.
- [ ] Remove business logic from route files and presentational components.
- [ ] Keep Server Components as the default.
- [ ] Review every `use client` boundary and remove unnecessary client code.
- [ ] Make loading, success, empty, and error states explicit.

## Phase 4: Mock API Layer

- [ ] Keep mocked backend behavior behind typed feature API modules.
- [ ] Route browser HTTP calls through the shared HTTP client.
- [ ] Define consistent request, response, error, and cancellation behavior.
- [ ] Validate unknown mock response data at the boundary.
- [ ] Map mock DTOs into domain or view models before rendering.
- [ ] Handle non-2xx responses, malformed data, timeouts, cancellation, retries, and stale requests.
- [ ] Avoid echoing raw request bodies or exposing implementation details in UI errors.
- [ ] Keep authentication and authorization behavior explicit in sensitive mock endpoints.
- [ ] Add deterministic mock fixtures for loading, empty, success, and failure scenarios.

## Phase 5: Feature Refactoring

- [ ] Refactor authentication without changing user-visible behavior.
- [ ] Refactor the home feature and its data flow.
- [ ] Refactor feedback and modal workflows.
- [ ] Refactor shared shell, navigation, and footer ownership.
- [ ] Remove duplicated feature models and utilities.
- [ ] Keep each feature internally cohesive and independently testable.
- [ ] Verify desktop and mobile behavior after each feature refactor.

## Phase 6: Design System and UI Components

- [ ] Inventory repeated controls and visual patterns.
- [ ] Define tokens for color, spacing, typography, radius, shadows, and motion.
- [ ] Consolidate buttons, links, tiles, cards, modals, skeletons, and navigation controls.
- [ ] Keep reusable components behavior-focused instead of page-specific.
- [ ] Ensure interactive controls use the correct native element.
- [ ] Add accessible names, visible focus, hover, pressed, disabled, and loading states.
- [ ] Keep stable dimensions for images, skeletons, carousels, grids, and fixed bars.
- [ ] Respect reduced-motion preferences.
- [ ] Validate visual behavior at mobile, tablet, desktop, and narrow desktop widths.

## Phase 7: Accessibility Review

- [ ] Review heading hierarchy and landmark structure.
- [ ] Review keyboard navigation and focus order.
- [ ] Review focus-visible styles against all backgrounds.
- [ ] Review button, link, menu, dialog, carousel, and disclosure semantics.
- [ ] Review ARIA state and relationship attributes.
- [ ] Review image alternatives and decorative image handling.
- [ ] Review form labels, validation messages, and error announcements.
- [ ] Review color contrast and non-color state indicators.
- [ ] Review reduced motion and zoom/reflow behavior.
- [ ] Run automated accessibility checks where available.
- [ ] Manually test the primary workflows with keyboard only.

## Phase 8: Security and Privacy Review

- [ ] Review all MSW handlers and any future server actions or route handlers as public endpoints.
- [ ] Validate and authorize sensitive requests at the server boundary.
- [ ] Review URL, image source, redirect, and external link validation.
- [ ] Review untrusted input handling and output rendering.
- [ ] Confirm no secrets are exposed through public environment variables.
- [ ] Confirm auth tokens are not stored in unsafe browser persistence.
- [ ] Review logs and errors for credentials, tokens, personal data, and raw payloads.
- [ ] Review third-party dependencies and known vulnerabilities.
- [ ] Review security headers and safe defaults where applicable.

## Phase 9: Performance and Resilience

- [ ] Review bundle size and client component cost.
- [ ] Review image loading, dimensions, priority, and responsive sizes.
- [ ] Review layout shift from loading states and dynamic content.
- [ ] Review unnecessary effects, event listeners, subscriptions, and rerenders.
- [ ] Review scroll, resize, media-query, and viewport listener cleanup.
- [ ] Review carousel, footer, floating bar, and responsive transition behavior.
- [ ] Test slow, failed, cached, and offline-like mock responses.
- [ ] Confirm the app remains usable during partial data failure.

## Phase 10: Testing Strategy

- [ ] Define the test pyramid for pure utilities, components, workflows, and browser tests.
- [ ] Add unit tests for parsing, validation, URL safety, and model mapping.
- [ ] Add component tests for loading, success, empty, error, keyboard, and reduced-motion states.
- [ ] Add browser tests for authentication, home page navigation, carousel interaction, and footer behavior.
- [ ] Cover mobile, narrow desktop, standard desktop, and resize transitions.
- [ ] Cover keyboard and accessibility workflows.
- [ ] Add visual regression coverage for production-matched surfaces where practical.
- [ ] Keep tests isolated and user-behavior focused.
- [ ] Remove flaky timing assumptions and uncontrolled network dependencies.

## Phase 11: Documentation and Production Review

- [ ] Document architecture ownership and dependency direction.
- [ ] Document mock API conventions and fixture usage.
- [ ] Document local development and validation commands.
- [ ] Document testing strategy and known limitations.
- [ ] Review every changed file for accidental scope expansion.
- [ ] Review duplicated logic and unused code one final time.
- [ ] Review all open findings and assign each one a decision: fix, defer, or reject.
- [ ] Run `npm run lint`.
- [ ] Run `npm run lint:naming`.
- [ ] Run `npm run typecheck`.
- [ ] Run all tests.
- [ ] Run `npm run build`.
- [ ] Review the final diff and commit history.
- [ ] Create a concise production-readiness report.

## Definition of Done for Each Change

- [ ] The change has one clear purpose.
- [ ] The owning module and dependency direction are correct.
- [ ] Naming, Tailwind, accessibility, and security rules are satisfied.
- [ ] Loading, success, empty, and error behavior are considered.
- [ ] Desktop, mobile, keyboard, and reduced-motion behavior are checked when relevant.
- [ ] Relevant lint, naming lint, typecheck, tests, and build checks pass.
- [ ] The diff contains no unrelated files or generated noise.
- [ ] The user has approved the atomic commit.
