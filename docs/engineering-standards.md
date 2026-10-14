# Shahrzad Engineering Standards

This guide defines how we organize and write the Shahrzad frontend. It is intentionally practical: the project is a frontend recreation with mocked backend behavior, not a full production backend.

## 1. The Architecture

We use a lightweight combination of Feature-Sliced Design and Clean Architecture.

The goal is clear ownership and predictable dependencies, not ceremony.

```text
src/
  app/       Next.js routes, pages, loading and error boundaries
  features/  user-facing capabilities such as auth, home, and feedback
  entities/  reusable domain models and domain-level types
  shared/    cross-feature UI, API transport, validation, and utilities
  mocks/     MSW handlers, deterministic fixtures, and mock-only state
```

### Dependency direction

Allowed direction:

```text
app -> features -> entities
app -> shared
features -> shared
mocks -> entities/shared
```

Rules:

- `src/app` composes pages and routes. It may call feature hooks/components, but it should not contain reusable business logic.
- `src/features` owns a user-facing capability. A feature may contain its API client, hooks, components, state, and feature-specific models.
- `src/entities` contains domain concepts that are shared by multiple features. Entity files must not import React, Next UI code, Axios, or browser-only APIs.
- `src/shared` contains code that has no feature-specific meaning. Do not move code here just to avoid deciding where it belongs.
- `src/mocks` contains the mock transport boundary. It must not import UI components or feature internals.
- A feature must not import another feature's private implementation. Cross-feature use must go through an explicit public contract such as `src/features/auth/public.ts`. If the behavior is not a stable feature API, move the smallest shared part to `shared` or `entities`.
- Avoid barrel files such as `index.ts` unless they provide a stable, intentional public API. Direct imports make ownership easier to see.

### Choosing where code belongs

Ask this question: “Would this code still make sense if the feature were removed?”

- Yes, for a domain type: `entities`.
- Yes, for a generic UI or utility: `shared`.
- No, because it describes one user workflow: `features`.
- No, because it implements a mock API boundary or fixture: `mocks`.
- It only connects a URL to a page: `app`.

## 2. File And Directory Naming

This project does not use kebab-case as a naming requirement. We use a React-oriented convention that keeps component files visually aligned with the component they export and keeps hooks and modules easy to scan.

| Purpose | Convention | Example |
| --- | --- | --- |
| React component file | PascalCase | `ServiceTile.tsx` |
| React component export | PascalCase | `ServiceTile` |
| Page | Next.js reserved lowercase name | `page.tsx` |
| Layout/loading/error/not-found | Next.js reserved lowercase name | `layout.tsx`, `loading.tsx` |
| Route handler | Next.js reserved lowercase name | `route.ts` |
| Client hook | camelCase beginning with `use` | `useHomeData.ts` |
| Feature API client | camelCase | `authApi.ts` |
| Shared utility | camelCase | `validation.ts`, `safeUrl.ts` |
| Entity model | camelCase inside the entity model folder | `entities/home/model/types.ts` |
| Store | camelCase | `authStore.ts` |
| Skeleton/loading component | PascalCase | `ServiceTileSkeleton.tsx` |
| Test | Match the unit under test | `serviceApi.test.ts` |
| Feature directory | lowercase for one word, camelCase for multiple words | `home`, `userProfile` |
| Documentation | readable lowercase filename | `engineering-standards.md` |

Rules:

- Keep framework-reserved Next.js names exactly as defined by Next.js.
- A component file should normally export a component with the same PascalCase name.
- A hook file should normally export the matching `useX` hook.
- Do not mix multiple casing styles for the same category.
- Do not use vague names such as `helpers.ts`, `common.ts`, or `misc.ts` when a specific name is possible. A shared `utils.ts` file is acceptable only when it is small and intentionally cohesive.
- Existing files may be migrated gradually. Do not rename unrelated files only to create metadata churn; rename a file when touching its feature or when the old name actively harms discoverability.
- ESLint enforces these source filename rules through the repository rule `project/file-name-convention`. A change is not complete while `npm run lint:naming` fails.
- Next.js URL route segments such as `about-shahrzad` and `login-register` are intentionally exempt because they are public URLs, not module filenames.
- The interview-provided MSW fixture is an exact external contract. Preserve the upstream paths and filenames for `src/mocks/browser.ts`, `src/mocks/server.ts`, the copied `src/app/MSWProvider.tsx`, and the generated `public/mockServiceWorker.js`; these fixture files are excluded from repository naming/style checks. This exception applies only to those copied fixture files, not to new application code.

## 3. Function, Component, And Variable Naming

- React components and TypeScript types use PascalCase: `ServiceTile`, `HomePayload`.
- Hooks use `useX`: `useHomeData`, `useAuthSession`.
- Functions use a verb or clear action: `getHomeData`, `parsePhoneNumber`, `safeHref`.
- Event handlers use `handleX`: `handleMenuClick`, `handleSubmit`.
- Async functions should describe the operation: `requestOtp`, `verifyOtp`, `submitFeedback`.
- Boolean values use `is`, `has`, `can`, or `should`: `isLoading`, `hasChildren`, `canSubmit`.
- Collections use plural nouns: `banners`, `serviceTiles`, `ratingOptions`.
- Constants use `SCREAMING_SNAKE_CASE` only for true module-level constants: `MAX_JSON_BODY_BYTES`.
- Avoid unexplained abbreviations. `API`, `URL`, `OTP`, `ID`, and `UI` are accepted domain abbreviations.
- Use `event` for a single event and `error` for an error. Do not use names such as `e`, `err`, `data2`, or `temp` in maintained code.
- Do not prefix every function with `handle`. Use `handle` for UI event callbacks; use a domain verb everywhere else.

## 4. Models And Types

Models are contracts, not convenience bags.

### Domain models

Put shared domain types in `src/entities/<entity>/model`.

```ts
export type AuthUser = {
  id: string;
  displayName: string;
  mobile: string;
};
```

Rules:

- Prefer `type` for object and union models unless declaration merging is specifically needed.
- Use string literal unions for finite states: `type FeedbackRating = "good" | "normal" | "bad"`.
- Keep optional fields meaningful. Do not make every field optional to avoid fixing callers.
- Do not put API transport concerns, React state, or UI-only fields in an entity model.
- Do not duplicate a domain model in several features. Add a mapping function if an API shape differs from the domain shape.

### API contracts

- Feature API request and response types live beside the feature API client when they are endpoint-specific.
- Shared response envelopes live in `src/shared/api`.
- MSW handlers validate unknown input before treating it as a typed value.
- Mock responses should have the same shape and failure behavior that the frontend expects from a real backend.
- Do not return arbitrary request bodies from mock endpoints. Return an explicit response model.

### React props

- Define a named `Props` type near the component when it is local and small.
- Use a named exported type when other files need the props contract.
- Keep props data-oriented. Pass callbacks for behavior instead of reaching into unrelated stores from leaf components.
- Avoid passing a large object when a component needs one or two fields.

## 5. Mock Backend Rules

The backend is intentionally mocked in this project.

- Keep application mock handlers under `src/mocks` and register them through the browser worker and Node test/dev server.
- Keep deterministic payloads and mock-only state beside those handlers under `src/mocks`.
- Do not create Next Route Handlers for application APIs unless the project explicitly adds a real server boundary.
- Preserve the API envelope `{ data, error, meta }`.
- Use realistic status codes and validation errors so the frontend exercises real states.
- Keep mock latency only where it helps verify loading and skeleton states.
- A fixed OTP is acceptable for this challenge, but it must remain clearly labeled as mock behavior and must not be presented as real authentication.
- Do not add database schemas, deployment infrastructure, background jobs, or provider integrations unless explicitly requested.

### Mock API boundary

The mock is an implementation detail. Components consume a typed feature API and must not know whether the result came from MSW, a future external service, or another transport.

- Feature API functions return promises and expose typed success and failure behavior.
- Mock latency is allowed when it verifies loading and skeleton states, but it must remain deterministic in tests.
- Validate unknown response data at the API boundary.
- Map transport DTOs to domain or view models before passing them into reusable UI.
- Represent loading, success, empty, and error states explicitly instead of treating every failure as an empty list.
- Keep the browser worker as the frontend mock boundary. Do not call mock handler functions directly from components.

## 6. React And Next.js Runtime Rules

These rules are framework behavior, not optional style preferences.

### Server and Client Components

- Pages and layouts are Server Components by default.
- Use a Client Component only when the code needs state, event handlers, effects, browser APIs, or a client-only library.
- Keep the `"use client"` boundary as low in the tree as practical so the browser receives less JavaScript.
- Render context providers as deep as possible rather than wrapping the entire document without need.
- Use `loading.tsx` and Suspense to stream independent or slow UI instead of blocking the entire route.

### React purity and state

- Components and hooks must be pure and idempotent.
- Never mutate props, state, hook arguments, or values after passing them to JSX.
- Call hooks only at the top level of React components and custom hooks.
- Store only the minimum changing state. Compute filtered lists, labels, counts, and other derived values during render.
- Use an Effect only to synchronize with an external system. Event-specific work belongs in event handlers.
- Prefer stable, explicit state machines or discriminated unions for complex async states.

### Routing and framework files

- Keep `src/app` focused on URL composition and framework boundaries.
- Use the framework file conventions exactly: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`, and `route.ts`.
- Add route-level error handling and accessible not-found UI where a route can fail or be missing.
- Use `next/link` for internal navigation and preserve normal browser navigation semantics.

## 7. UI And Component Rules

- Prefer server components. Use client components only for interaction, browser APIs, client state, effects, or client-only libraries.
- Keep route pages as composition layers. Move reusable UI into feature components.
- Separate data access from presentation: API clients and hooks fetch data; components render it and emit user intent.
- A component should have one clear reason to change. Split a component when it mixes data fetching, form logic, layout, and several unrelated visual regions.
- Keep loading, error, empty, and success states explicit. Do not hide a failed request behind an empty array.
- Reuse project primitives and the existing design system before creating a new abstraction.
- Use icons from the existing icon library. Do not hand-draw an icon when an approved library icon exists.
- Interactive buttons need `type="button"` unless they intentionally submit a form.
- Use stable dimensions for fixed-format UI such as tiles, skeletons, toolbars, and navigation controls.
- Keep responsive behavior in the component that owns the layout. Do not scatter breakpoint fixes across unrelated files.
- Avoid nested cards, decorative blobs, unexplained gradients, and one-color visual systems.
- Keep text inside its container at mobile and desktop widths. Test long labels and RTL alignment.

### Loading and async UI

- Every async feature must define loading, success, empty, and error behavior.
- Skeletons should preserve the final layout dimensions to reduce layout shift.
- Error UI should explain the recoverable action and expose a retry or navigation path when appropriate.
- Do not replace a failed request with an empty success state.

## 8. Accessibility Rules

- Every input has a visible label or an equivalent accessible label.
- Every icon-only control has an accessible name.
- Use native links and buttons for navigation and actions. Do not make a `div` clickable.
- If a mock-only behavior is outside the current scope, render the control disabled or link it to an explicit placeholder. Never leave a clickable control with no behavior.
- Use `aria-pressed`, `aria-expanded`, `aria-current`, or `aria-busy` when the state is meaningful.
- Errors must be visible and announced with `role="alert"` or an equivalent accessible pattern.
- Focus must be visible and keyboard navigation must work without a mouse.
- Decorative images use `alt=""`; meaningful images describe their content.
- Respect `prefers-reduced-motion` for animation and smooth scrolling.
- Do not use color alone to communicate state.
- Check mobile layout, keyboard flow, focus order, and screen-reader names before finishing a UI change.

Use automated linting as an early signal, then verify the changed workflow manually with keyboard navigation and an accessibility tree or screen reader. Automated checks cannot prove that the interaction is understandable or that focus moves correctly.

## 9. Security And Data Handling

Even with mocked data:

- Validate all external or route input at the boundary.
- Allowlist dynamic URLs and asset origins.
- Never put auth tokens, OTPs, or sensitive session state in `localStorage` or `sessionStorage`.
- Do not log phone numbers, tokens, cookies, request bodies, or other sensitive values.
- Do not use `dangerouslySetInnerHTML` for API content.
- Keep server secrets out of `NEXT_PUBLIC_*` variables.
- Keep security headers and cookie configuration centralized rather than duplicated in components.
- Treat every Server Action and Route Handler as a public endpoint. Client-side hiding is not authorization.
- Verify authentication and authorization inside each sensitive mutation, including mock mutations that are intended to model production behavior.
- Add a Content Security Policy and review allowed image, font, and script origins before production.

## 10. TypeScript And Imports

- Keep TypeScript strict and avoid `any`.
- Prefer narrowing and validation over broad type assertions.
- Do not use `as` to silence a type error without documenting the boundary that makes it safe.
- Use the `@/*` alias for project imports.
- Import from the owning feature or layer, not through deep implementation paths of another feature.
- Keep imports grouped: external packages first, then project imports.
- Remove unused code and stale directories when moving modules.

Prefer runtime validation at boundaries over type assertions. TypeScript types disappear at runtime; a response from a Route Handler, file, browser API, or mock is unknown until it has been checked.

## 11. Tailwind CSS And Version Control

### Tailwind CSS v4

- Prefer supported Tailwind v4 theme and scale utilities over arbitrary bracket values when the result is equivalent. For example, use `h-50`, `top-3.5`, `w-29.5`, `leading-5.5`, and `text-white!` instead of their older arbitrary or prefix forms.
- Add repeated Shahrzad colors and shared design values to the global `@theme` block in `src/app/globals.css`, then use the generated named utilities such as `bg-shahrzad-primary` and `text-shahrzad-ink`.
- Keep arbitrary values when they preserve an exact production requirement and Tailwind has no equivalent: `calc(...)` geometry, non-scale radii, custom aspect ratios, measured font metrics, production-specific shadows, and CSS feature variants such as `supports-[corner-shape:squircle]`.
- Do not replace an exact value with the nearest spacing or radius token only to remove brackets. Visual fidelity and stable layout dimensions take priority.
- Review new class names with the Tailwind v4 IntelliSense/linter. Do not invent class spellings when a theme token or supported utility exists.

### Commit approval

- Do not run `git add`, `git commit`, or create a commit automatically.
- A commit is allowed only after the user explicitly approves committing in the current turn.
- Before requesting approval, leave the worktree reviewable and report the checks that passed, the files changed, and any remaining uncommitted user edits.

## 12. Performance And Production Readiness

- Use `next/image` for content images and provide stable dimensions or aspect ratios.
- Use the Next.js Font Module for application fonts, including Vazirmatn when the selected font source supports it.
- Use intentional caching and revalidation. Document data that must always be fresh.
- Fetch independent data in parallel and avoid client-side waterfalls.
- Lazy-load large client-only components and third-party libraries when they are not needed for the first view.
- Measure Lighthouse and Core Web Vitals against a production build, not only the development server.
- Use bundle analysis when a feature adds a large dependency or increases client JavaScript unexpectedly.
- Prefer React Compiler only after confirming compatibility and testing; do not add manual memoization for correctness.

## 12. Testing Strategy

- Test pure model, validation, mapping, and utility functions with unit tests.
- Test important component states and interactions without asserting implementation details.
- Use Playwright for user-visible workflows, responsive layouts, keyboard behavior, and visual regression where pixel accuracy matters.
- Prefer semantic locators such as roles, labels, and visible text over CSS selectors and internal component names.
- Keep browser tests isolated and deterministic. Mock services that are outside our control.
- Test at least the main desktop and mobile breakpoints for layout-sensitive features.

## 13. Review And Verification

Before considering a change complete:

1. Review the diff for ownership, naming, duplicated models, and accidental scope expansion.
2. Check loading, error, empty, success, mobile, desktop, keyboard, and reduced-motion states when relevant.
3. Run:

```bash
npm run lint
npm run lint:naming
npm run typecheck
npm run build
```

4. For API changes, verify malformed input, missing auth, invalid URLs, oversized bodies, rate-limit behavior, and the success contract.
5. For UI changes, perform a browser smoke test and inspect the accessibility tree for the changed controls.
6. Update this guide only when a convention is intentionally changed for the whole project.

## 14. Research Basis And External Standards

These rules are based on the current primary documentation, not on an assumption that Airbnb or Angular defines React and Next.js.

- [Next.js production checklist](https://nextjs.org/docs/app/guides/production-checklist): performance, loading, accessibility, security, metadata, and production verification.
- [Next.js Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components): default server rendering and narrow client boundaries.
- [Next.js data fetching](https://nextjs.org/docs/app/getting-started/fetching-data): server fetching, streaming, parallel requests, and caching.
- [Next.js authentication](https://nextjs.org/docs/app/guides/authentication): validation, authorization, data access layers, and secure mutations.
- [React Rules](https://react.dev/reference/rules): purity, immutability, and hook rules.
- [React state design](https://react.dev/learn/thinking-in-react): minimal state and derived values.
- [React Effects](https://react.dev/learn/you-might-not-need-an-effect): effects as synchronization with external systems.
- [Playwright best practices](https://playwright.dev/docs/best-practices): user-visible assertions, isolation, semantic locators, and browser coverage.

## 15. Airbnb And Clean Architecture

Airbnb is useful as a style baseline, especially for naming, imports, predictable JavaScript, and avoiding implicit behavior. The repository already uses ESLint and Next's core web vitals rules as the automated baseline.

Clean Architecture is useful here as a dependency principle: UI should not own transport details, domain models should not depend on UI, and server-only code must stay out of the browser. We are using a lightweight version rather than introducing layers, interfaces, or abstractions that do not solve a real problem.

When a rule conflicts with readability or the existing Next.js conventions, choose the smallest clear implementation and document the exception in the review.
