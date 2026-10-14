# Shahrzad Homepage Challenge

Production-oriented recreation of the Shahrzad web homepage flow.

## What Was Recreated

- Public `/home` access follows the reference behavior and redirects unauthenticated users to `/login-register?redirectTo=/home`.
- `/login-register` recreates the RTL login/register screen, tabs, mobile number validation, mocked OTP step, footer links, and legal signup entry state.
- Authenticated `/home` recreates the Shahrzad dashboard pattern: blue patterned header, logo/user controls, carousel banners, service tiles, nested service drawer, mobile floating action bar, footer artwork, loading states, and feedback modal.
- Data comes from a mock backend implemented with Next route handlers under `/api`.

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

For a quick authenticated preview, enter any valid Iranian mobile number such as `09123456789`, click `مرحله بعد`, and use the mock OTP `123456`.

## Docker

```bash
docker build -t shahrzad-homepage .
docker run --rm -p 3000:3000 shahrzad-homepage
```

## Environment

Copy `.env.example` to `.env.local` if you want to point Axios at a different backend.

```bash
NEXT_PUBLIC_API_BASE_URL=/api
NEXT_PUBLIC_REFERENCE_URL=https://web.shahrzadcity.ir/home
AUTH_SESSION_SECRET=replace-with-a-long-random-secret
```

`AUTH_SESSION_SECRET` is required in production and must be a long, private, randomly generated value. Never expose it with a `NEXT_PUBLIC_` prefix.

## Architecture

- `src/app` contains route composition, pages, route handlers, and route-level loading/error UI.
- `src/features` contains user-facing feature modules with their API clients, hooks, and components.
- `src/entities` contains shared domain models.
- `src/shared` contains transport, validation, URL safety, reusable UI, and cross-feature utilities.
- `src/server` contains server-only sessions, mock data, and request handling primitives.

See [`docs/engineering-standards.md`](docs/engineering-standards.md) for the maintainability rules, naming conventions, model conventions, dependency direction, UI/accessibility standards, and review checklist.

All API responses use `{ data, error, meta }`. Route handlers validate JSON bodies, enforce bounded payload sizes, attach request IDs, normalize public errors, and avoid returning request bodies. Authentication is represented by an HttpOnly signed cookie rather than browser-persisted tokens.

## Scope Notes

The reference app currently serves a protected homepage. Without auth, `/home` redirects to `/login-register?redirectTo=/home`; the implementation mirrors that behavior and uses mocked route handlers for tiles, banners, auth, and feedback. Public assets from the reference app were used for the Shahrzad logo, header/footer patterns, and footer illustration. AI assistance was used to inspect the challenge PDF, map the reference bundle, and scaffold the implementation; the submitted code remains intentionally readable and explainable.

The auth and data routes are intentionally mock implementations for this challenge. Maintain the frontend contracts and realistic loading/error behavior, but do not add backend infrastructure unless the project scope explicitly changes.
