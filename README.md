# Shahrzad Frontend Challenge

A production-oriented recreation of the Shahrzad web experience, focused on visual fidelity, responsive behavior, maintainable frontend architecture, and realistic mocked API workflows.

## Implemented Experience

- Protected `/home` route with redirect to `/login-register?redirectTo=/home` for unauthenticated users.
- RTL login and registration flow with Iranian mobile validation, Persian digits, keyboard submission, and a mocked six-digit OTP (`123456`).
- Responsive Home page with the production-style header, wallet state, autoplay carousel, service grid, loading skeletons, mobile floating navigation, feedback flow, and footer artwork.
- Shared nested-page shell used by routes such as `/services` and `/login-register`.
- A single inner content scroll model on mobile and desktop, including mobile-only header compaction and desktop footer reveal behavior.
- Explicit loading, empty, error, and success states around asynchronous UI.

## Technology

- Next.js 16 App Router and React 19
- TypeScript and Tailwind CSS 4
- Ant Design and IconSax
- SWR for remote state and Axios for HTTP transport
- Mock Service Worker (MSW) for frontend-only backend simulation
- Swiper for the reusable carousel
- Vitest and Playwright for automated verification
- ESLint and Husky for repository quality gates

## Local Development

### Requirements

- Node.js 22
- npm 11.6.2

Install dependencies:

```bash
npm ci
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000/home](http://localhost:3000/home).

Enter a valid Iranian mobile number, such as `09123456789`, and use the mock OTP `123456` to complete authentication.

### Environment Variables

An optional `.env.local` can be created from `.env.example`:

```bash
cp .env.example .env.local
```

Example configuration:

```dotenv
NEXT_PUBLIC_REFERENCE_URL=https://web.shahrzadcity.ir/home
```

This variable is public reference configuration and does not contain sensitive information.

Never store secrets in `NEXT_PUBLIC_*` variables, as their values may be embedded in client-side JavaScript during the production build.

## Verification

Run the complete static analysis, unit testing, and production-build checks:

```bash
npm run check
```

Run browser-based end-to-end tests separately:

```bash
npm run test:e2e
```

The repository includes versioned Husky hooks:

- Pre-commit: linting, naming conventions, type checking, and tests.
- Pre-push: the complete production-build verification gate.

These checks help prevent regressions and maintain consistent code quality.

## Docker

The application includes a multi-stage Dockerfile designed for production deployment using Next.js standalone output.

The Docker image:

- Uses Node.js 22 Alpine as its base.
- Pins npm to version `11.6.2` for consistent dependency installation.
- Installs dependencies with `npm ci`.
- Produces an optimized Next.js standalone build.
- Uses a dedicated non-root user for application execution.
- Exposes port `3000`.
- Excludes unnecessary files and sensitive local configuration through `.dockerignore`.

### Build the Docker Image

From the project root, run:

```bash
docker build -t shahrzad-homepage .
```

For a clean build without cached build steps:

```bash
docker build --no-cache -t shahrzad-homepage .
```

### Run the Docker Container

```bash
docker run --rm \
  --name shahrzad-homepage \
  -p 3000:3000 \
  shahrzad-homepage
```

Once the server starts, open:

[http://localhost:3000/home](http://localhost:3000/home)

Use `Ctrl+C` to stop the container.

### Verify the Running Application

Check the HTTP response:

```bash
curl -I http://localhost:3000/home
```

A successful response should return HTTP `200`.

The application should also be verified manually for successful authentication, mocked API responses, navigation, assets, and responsive behavior.

### Environment Configuration

The project uses browser-based MSW handlers to simulate its backend functionality. No separate backend container is required for the implemented mock workflows.

Public environment variables prefixed with `NEXT_PUBLIC_*` must be available at build time when required by the application.

Runtime secrets, if introduced in the future, must be supplied through the deployment platform or external runtime environment configuration.

Secrets must never be committed to the repository or embedded in the Docker image.

## Architecture

The project follows a lightweight combination of Feature-Sliced Design and Clean Architecture principles:

```text
src/
├── app/       Next.js routes and framework boundaries
├── features/  User-facing workflows, API clients, hooks, and components
├── entities/  Shared domain models
├── shared/    Cross-feature transport, utilities, constants, and UI
└── mocks/     MSW handlers, deterministic payloads, and mock-only state
```

Dependencies flow from `app` to `features`, then to `entities` and `shared`.

UI components do not directly invoke Axios, `fetch`, or MSW handlers.

Feature API modules own endpoint contracts and communicate through the shared HTTP client.

Detailed architectural conventions are documented in [`docs/engineering-standards.md`](docs/engineering-standards.md).

## API and Mocking

The challenge requires frontend behavior rather than backend infrastructure. Application endpoints are therefore simulated in the browser using Mock Service Worker (MSW).

The UI consumes mocked endpoints through standard HTTP requests and remains independent of the mock implementation.

Key implementation details:

- Responses follow the shared `{ data, error, meta }` envelope.
- Request bodies and transport responses are validated at their boundaries.
- Authentication uses an HTTP-style mock session cookie instead of browser token storage.
- Handlers model HTTP status codes, network latency, validation failures, rate limits, and request IDs.
- API errors are normalized centrally and surfaced through the application toast provider.

This separation allows mock API implementations to be replaced with real backend services without rewriting presentational components.

## Engineering Decisions

### Separate Home and Nested Layouts

The Home page manages its own collapsing mobile header, footer reveal behavior, overlays, and floating navigation.

Nested pages use a smaller, configurable layout without inheriting Home-specific behavior.

### Single Scroll Owner

A single inner content scroll region is used across mobile and desktop layouts.

The header remains outside the scrolling region, preventing inconsistent document-scroll behavior, lost event listeners during navigation, and unwanted desktop header movement.

### SWR for Remote State

SWR handles remote state such as Home content, wallet information, sessions, and feedback reads through caching and revalidation.

One-off commands, including OTP verification, remain explicit mutations.

### Centralized Routing and Safe URLs

Centralized route constants eliminate navigation magic strings.

URL and asset normalization utilities constrain dynamic destinations and reduce the risk of unsafe navigation.

### Reusable UI with Feature Ownership

Generic components belong to `shared/ui`.

Domain-specific components, including service grids, loading skeletons, and carousel compositions, remain within their respective features.

### Accessibility

The interface incorporates:

- Semantic HTML elements.
- Accessible names and labels.
- Visible keyboard focus states.
- Announced validation errors.
- RTL-aware interactions.
- Reduced-motion support.

### Security Defaults

The application includes:

- A restrictive Content Security Policy.
- Clickjacking protection.
- MIME sniffing protection.
- Limited browser permissions.
- Input validation.
- No persisted authentication tokens in browser storage.

These protections improve frontend security but do not replace server-side security enforcement.

## Tradeoffs and Scope

- Authentication, rate limiting, and data persistence are realistic mocks, not production security boundaries.
- Some reference links point to features outside the challenge scope and are represented as safe navigation targets or disabled controls.
- Visual behavior was prioritized around the supplied Home, services, and authentication workflows rather than recreating unrelated Shahrzad products.
- Browser tests cover high-risk workflows rather than exhaustive visual snapshot testing, keeping the test suite focused and maintainable.
- The application is structured to support real API integration without significant changes to presentational components.

## AI-Assisted Workflow

OpenAI Codex was used as a pair-programming tool throughout the project.

It assisted with:

- Reading the challenge PDF and inspecting the reference application and captured production assets.
- Comparing responsive layouts and identifying measurable visual differences.
- Proposing and implementing scoped refactors, tests, Docker configuration, and documentation.
- Running linting, type checking, production builds, browser tests, and code-review passes.
- Organizing changes into focused commits following explicit approval.

AI-generated output was not accepted blindly.

Changes were reviewed against reference behavior and repository engineering standards, refined through browser inspection, and validated using the project's verification workflows.

The final architectural decisions, implementation tradeoffs, and submitted code remain the responsibility of the author.
