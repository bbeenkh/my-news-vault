# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MYNEWSVAULT is a Korean news search and scrapbook app built with Next.js 14 App Router. It uses the Bing News Search API for search and Firebase Firestore to persist scrapped news articles per user.

## Commands

```bash
yarn dev            # Start dev server on port 4000
yarn dev:mock       # Start dev server with MSW mock APIs enabled (NEXT_PUBLIC_MSW_ENABLED=true)
yarn build          # Production build
yarn start          # Start production server on port 4000
yarn lint           # ESLint check
yarn test           # Run Jest tests (uses --experimental-vm-modules)
yarn test:coverage  # Run tests with coverage report
yarn storybook      # Start Storybook on port 6006
yarn build:analyze  # Build with bundle analyzer (ANALYZE=true)
```

To run a single test file:
```bash
yarn test src/utils/utils.test.ts
```

## Architecture

### App Router Structure

Route groups organize layouts independently:
- `app/(landingPageGroup)/` — landing page with its own layout
- `app/(servicePageGroup)/` — search and scrap pages with shared layout
- `app/api/` — API routes: `/api/scrap` (Firestore scrap ops), `/api/token/save|remove` (auth cookie management)

### Component Architecture (Atomic Design)

`src/components/` follows strict atomic design:
- **atoms/** — primitive UI (Button, Input, CardUI, Dialog, InfiniteScroll, Skeleton, Toast, ErrorBoundary)
- **molecules/** — composed atoms (LoginButton, LogoutButton, ProfileButton)
- **organisms/** — feature-level components under `search/` and `scrap/`
- **templates/** — page-level layouts wiring organisms together
- **etc/** — global providers and MSW setup

The codebase applies a **presenter-viewer pattern** to separate UI rendering from business logic.

### State Management

- **Jotai** (`src/hooks/useAuth.tsx`) — client-side auth state via `authAtom`
- **React Query / TanStack Query** (`src/queries/`) — server state, data caching, and prefetching
  - `queryOptionsFactory.ts` uses `@lukemorales/query-key-factory` for typed query keys
  - Scrap list is prefetched server-side and hydrated via `HydrationBoundary`
- **JotaiHydrateProvider** — syncs server-fetched user info into Jotai atoms on the client

### Data Flow

1. Server components prefetch data in `src/prefetch/` and pass dehydrated state via `HydrationBoundary`
2. Client components consume data through React Query hooks in `src/queries/`
3. Firebase Firestore (via `src/firebase/`) stores user scrap lists; Firebase Admin SDK (`src/firebase/admin.ts`) handles server-side auth token verification
4. Bing News Search API is called through `src/api/BingAPI.ts` (Axios instance) via Next.js API routes

### Mock API (MSW)

MSW 2.x is configured for both browser and Node environments:
- `src/msw/handler/` — request handlers
- `src/msw/browser.ts` / `src/msw/server.ts` — environment-specific workers
- Enable in dev with `yarn dev:mock`; auto-enabled in Jest tests

### Path Aliases

`@/*` maps to `./src/*` (configured in `tsconfig.json` and `jest.config.js`).

### Styling

Tailwind CSS with custom config:
- Custom breakpoints: `mobile`, `tablet`, `desktop`
- Dark mode: class-based (`dark:`)
- shadcn/ui component primitives (Radix UI + CVA)
- Custom color namespace `mnv-*` (gray, blue, error)
- SVGR: import SVGs as React components (`import Icon from '@/assets/icon.svg'`)

### Testing

- Jest + React Testing Library with `jest-environment-jsdom`
- Test files: `*.test.ts(x)` anywhere under `src/`
- MSW handlers are reused in tests via `src/msw/server.ts`
- Coverage threshold: 70% across statements/branches/functions/lines for `./src/`
- Storybook uses `mswLoader` so stories with API calls work without a backend

### Firebase

- Client SDK: `src/firebase/index.ts` — initializes app, exports `auth` and `db` (Firestore)
- Admin SDK: `src/firebase/admin.ts` — used only in API routes for server-side token verification
- Firestore security rules: `firestore.rules`

### Deployment

- Docker: `yarn docker:build` / `yarn docker:run` (Next.js standalone output on port 3000)
- PM2: `ecosystem.config.js` for cluster-mode production deployment
- CI/CD workflows live in `workflows/` (not `.github/workflows/`)
