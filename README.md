# NJ TRANSIT Web Clone

## Project Overview

A mobile-first, educational reconstruction of the verified screens in a user-provided 50.52-second NJ TRANSIT app recording. The recording is the visual authority; unseen screens are explicitly identified as unverified rather than invented.

See the [screen inventory and uncertainties](analysis/SCREEN_INVENTORY.ko.md), [visual comparison report](analysis/VALIDATION.ko.md), and [captured implementation screens](analysis/implementation/).

## Features

- Home, two service notices, Rider Tools system-status list, Buy Tickets and verified Quick Buy flow.
- Six observed fare rows, quantity controls, calculated totals and checkout availability.
- My Tickets, selection/cancellation, local preview confirmation, ticket detail/enlargement, instructions sheet and All Tickets history.
- Persistent local preview state and configurable ticket appearance; refresh feedback and browser history.
- Mobile layout, desktop phone-width preview, accessible dialogs, reduced-motion support, installable PWA assets and an offline shell.

## Technology Stack

React 19, TypeScript, Vite, Tailwind CSS 4, React Router, Zustand, Lucide, Vitest, React Testing Library and Playwright. No backend or private transit endpoints.

## Application Architecture

- `src/app/`: route composition, observed home and Rider Tools screens.
- `src/components/`: shared icons and focus-managed modal.
- `src/features/tickets/`: purchase/selection, lists, details, types and centralized theme.
- `src/services/transit.ts`: typed recording fixtures and service boundary.
- `src/store/`: persisted local Zustand state.
- `src/styles/`: geometry scaled from the 592px recording.
- `public/`: original SVG illustrations, PWA icons, manifest and service worker.

The six observed fares apply only to the verified first Quick Buy entry. Other routes do not receive invented fares. Unverified controls open an explanation with an About link. No real transaction occurs.

## Installation

Node.js 22.12+ (Node 22 LTS recommended):

```sh
npm ci
npx playwright install chromium
```

## Local Development

```sh
npm run dev
```

Open the URL printed by Vite. Local development uses browser routes. The GitHub Pages build uses hash routes so refreshing `/bus/#/tickets` works without a server rewrite.

To repeat video analysis locally, retain the original recording in `IMAGE/` and run:

```sh
python -m pip install imageio-ffmpeg pillow
python scripts/extract.py
python scripts/dense.py
python scripts/keyframes.py
python scripts/additional.py
```

These scripts use FFmpeg through `imageio-ffmpeg`. Original media, extracted frames and original-image comparisons are ignored by Git and are not deployed. `analysis/scene-times.json` retains the detected transition timestamps.

## Environment Variables

No secrets or environment variables are required. No official API credentials are present. Vite's build-time `BASE_URL` controls assets, router and service-worker registration.

## Testing

```sh
npm run lint
npm test
npm run test:e2e
npm run test:pages
```

E2E testing builds and starts its own development and production-preview servers. Captures are written to `analysis/implementation/`. Ten Chromium E2E cases, two Pages-specific cases and five unit/component tests cover observed navigation, fare math, persistence, unknown states, responsive layouts and production offline caching. Real iOS/Android devices have not been tested.

## Production Build

```sh
npm run build
npm run preview
```

For GitHub Pages under `/bus/`:

```sh
npm run build:pages
npm run preview -- --base=/bus/
```

## Deployment

GitHub Actions workflow `.github/workflows/pages.yml` runs checks, builds with `/bus/`, uploads `dist`, and deploys with the official GitHub Pages actions. Repository Settings → Pages → Source is GitHub Actions.

The owner explicitly selected a **public** repository and free GitHub Pages after GitHub rejected Pages for the original private repository on the current plan. Vercel is not required. Original recordings and screenshots containing ticket credentials are excluded from source and deployment.

## Live Website

Deployment verification is pending. The production URL will be linked here only after a successful deployment and unauthenticated access check.

## Project Limitations

- Recording fixtures are not current/live transit data, service notices, expiry times or fare quotes.
- Unopened menus, trip search/results, train/bus/light-rail destination pages, zone selectors, checkout/payment/refund/account/settings flows are unverified and intentionally not fabricated.
- No valid tickets, QR codes, fare tokens, security animations, operational color schedules, purchases or payments.
- Ticket detail always says **NOT VALID FOR TRAVEL**. Its static border/accent colors are arbitrary development colors persisted through the centralized theme, not operational verification colors. A future manual theme editor can use `setAppearance` without changing ticket components.
- Background/news artwork and line emblems are original approximations. Fonts/icons differ from the native app. This is not a pixel-perfect claim.
- Favorites persistence is prepared at the state layer; no unobserved Favorites UI is invented.
- API access remains unconfigured. See the official [app information](https://www.njtransit.com/app) and [developer portal](https://developer.njtransit.com/registration/loginsein). No private or undocumented ticket endpoints are used.
- Clearing browser storage resets local state. Cache availability depends on a successful online visit and browser service-worker support.

## Unofficial Project Notice

This project is unofficial, educational, and unaffiliated with NJ TRANSIT. NJ TRANSIT names and marks belong to their respective owners. No endorsement is implied. The website cannot be used for travel, ticket verification, purchases or real-time travel planning. Public artwork was drawn for this implementation; original recording images remain local.
