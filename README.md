# Shahrzad Homepage Challenge

Production-oriented recreation of the Shahrzad web homepage flow.

## What Was Recreated

- Public `/home` access follows the reference behavior and redirects unauthenticated users to `/login-register?redirectTo=/home`.
- `/login-register` recreates the RTL login/register screen, tabs, mobile number validation, mocked OTP step, footer links, and legal signup entry state.
- Authenticated `/home` recreates the Shahrzad dashboard pattern: blue patterned header, logo/user controls, carousel banners, service tiles, nested service drawer, mobile floating action bar, footer artwork, loading states, and feedback modal.
- Data comes from a mock backend implemented with Mock Service Worker handlers under `src/mocks`.

## Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS
- Ant Design
- Zustand
- SWR
- Axios
- IconSax

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000/home`.

For a quick authenticated preview, enter any valid Iranian mobile number such as `09123456789`, click `مرحله بعد`, and use the mock OTP `123456`. MSW handles the application API calls in the browser.

## Docker

```bash
docker build -t shahrzad-homepage .
docker run --rm -p 3000:3000 shahrzad-homepage
```

## Environment

Copy `.env.example` to `.env.local` for the reference URL configuration.

```bash
NEXT_PUBLIC_REFERENCE_URL=https://web.shahrzadcity.ir/home
```

## Architecture

- `src/app` contains route composition, pages, and route-level loading/error UI.
- `src/features` contains user-facing feature modules with their API clients, hooks, and components.
- `src/entities` contains shared domain models.
- `src/shared` contains transport, validation, URL safety, reusable UI, and cross-feature utilities.
- `src/mocks` contains the MSW application handlers, deterministic fixtures, and worker/server bootstrap modules.

See [`docs/engineering-standards.md`](docs/engineering-standards.md) for the maintainability rules, naming conventions, model conventions, dependency direction, UI/accessibility standards, and review checklist.

All API responses use `{ data, error, meta }`. MSW handlers validate JSON bodies, enforce request limits, attach request IDs, normalize public errors, and avoid returning request bodies. Authentication is represented by MSW's persisted mock cookie store.

## Scope Notes

The reference app currently serves a protected homepage. Without auth, `/home` redirects to `/login-register?redirectTo=/home`; the implementation mirrors that behavior and uses MSW handlers for tiles, banners, auth, and feedback. Public assets from the reference app were used for the Shahrzad logo, header/footer patterns, and footer illustration. AI assistance was used to inspect the challenge PDF, map the reference bundle, and scaffold the implementation; the submitted code remains intentionally readable and explainable.

The auth and data handlers are intentionally mock implementations for this challenge. Maintain the frontend contracts and realistic loading/error behavior, but do not add backend infrastructure unless the project scope explicitly changes.
