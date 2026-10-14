<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project Engineering Rules

Read [`docs/engineering-standards.md`](docs/engineering-standards.md) before changing application code. That document is the human-readable source of truth for architecture, naming, models, UI, accessibility, security, testing, and review conventions.

The following rules are mandatory for this repository:

1. Follow Next.js App Router conventions. Keep route files, layouts, loading UI, error boundaries, and not-found UI in `src/app`; keep reusable workflow code in `src/features`.
2. Keep the dependency direction `app -> features -> entities/shared` and `mocks -> entities/shared`. Do not put business logic in route files, and do not import UI or browser components into `src/mocks`.
3. Organize user-facing work by feature. New feature code belongs in `src/features/<featureName>/{api,components,hooks,model,store}` as needed. Add code to `src/shared` only when it is genuinely cross-feature.
4. Do not use kebab-case as a repository naming rule. Use PascalCase for React component files and classes, camelCase for hooks, functions, API modules, stores, utilities, and multiword directories. Keep Next.js reserved files lowercase: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`, and `route.ts`.
5. Use PascalCase for React components and types, `useX` for hooks, verb-first names for functions, `handleX` for event callbacks, and `is/has/should/can` prefixes for booleans.
6. Keep shared domain models in `src/entities/<entity>/model`. Keep endpoint-specific request and response types beside their feature API client. Do not duplicate the same domain type across features.
7. Keep mocked backend behavior behind typed feature API modules and the MSW handlers under `src/mocks`. Do not add Next Route Handlers, databases, queues, external providers, or backend infrastructure unless explicitly requested.
8. Keep browser HTTP calls behind `src/shared/api/http.ts` and feature API modules. Do not call Axios, `fetch`, or API URLs directly from presentational components. Define mock endpoints only in `src/mocks`; do not call mock handlers directly from UI code.
9. Model loading, success, empty, and error states explicitly. Validate unknown API or route data at the boundary and map transport DTOs into domain or view models before rendering.
10. Prefer Server Components. Add `"use client"` only for state, event handlers, effects, browser APIs, or client-only libraries. Keep client providers as deep in the tree as possible.
11. Keep React components and hooks pure. Do not mutate props, state, or values after passing them to JSX. Call hooks only at the top level of React functions. Use effects only to synchronize with external systems.
12. Do not use `any`, unsafe dynamic `href`/`src`, browser-persisted auth tokens, raw request-body echoing, or `dangerouslySetInnerHTML`. Keep secrets out of `NEXT_PUBLIC_*` variables and validate all untrusted input.
13. Treat Server Actions and Route Handlers as public endpoints. Perform authentication and authorization inside every sensitive action; client-side visibility checks are not security controls.
14. Every interactive control must have real behavior, an accessible name, keyboard support, visible focus, and the correct native element. Use appropriate ARIA state, announce errors, provide useful image alternatives, and respect reduced motion.
15. Use Next.js performance primitives: `next/image`, the Font Module, `next/link`, loading UI, Suspense, parallel data fetching, and intentional caching. Preserve stable dimensions for images and skeletons to avoid layout shift.
16. Test user-visible behavior rather than implementation details. Use semantic roles and labels in browser tests, isolate tests, and cover desktop, mobile, keyboard, loading, error, empty, and reduced-motion states where relevant.
17. Before finishing a change, run `npm run lint`, `npm run lint:naming`, `npm run typecheck`, and `npm run build`. Fix failures instead of suppressing them. Review the diff for ownership, duplicated models, security regressions, and accidental scope expansion.
18. Use Tailwind CSS v4 supported theme and scale utilities instead of arbitrary bracket values when an equivalent exists. Prefer utilities such as `h-50`, `top-3.5`, `w-29.5`, `leading-5.5`, and the v4 important modifier `text-white!`. Put repeated project colors and design values in `@theme` and use their generated named classes. Keep arbitrary values only when no supported equivalent preserves the design, such as exact `calc(...)` geometry, non-scale radii, aspect ratios, production-specific shadows, measured font metrics, or `supports-[...]` feature variants.
19. Do not run `git add`, `git commit`, or create a commit unless the user explicitly approves committing in the current turn.

Do not create a second convention document or silently weaken these rules. Update the human-readable guide when a project-wide rule changes.
