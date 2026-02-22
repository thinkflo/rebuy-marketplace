# rebuy Marketplace

A community-driven offers platform built with **Angular 21**, **Tailwind CSS v4**, and **MockAPI.io**.

## Features

- Browse offers sorted by community votes
- Detailed offer pages with category and date metadata
- Upvote/downvote with optimistic updates and automatic rollback on failure
- Purchase confirmation modal flow
- Responsive, mobile-first design
- Lazy-loaded routes
- FLIP animation on list reorder

## Quick Start

```bash
npm install
ng serve
```

Open [http://localhost:4200](http://localhost:4200)

## Architecture Decisions

- **Zoneless + Signals** — Angular 21's default (no zone.js). All reactive state uses signals for native change detection.
- **Standalone components** — No NgModules; explicit imports per component.
- **Optimistic voting with rollback** — UI updates instantly, reverts on API failure.
- **Client-side re-sort** — Server sorts on initial load; votes re-sort locally for instant feedback.
- **Smart/presentational split** — Pages own state and API calls; components receive inputs and emit events.
- **Single source of truth** — Route paths and param names live in `app.routes.ts`; display currency and sort helpers in `core/` to keep links and behaviour consistent and easy to change.

## Project Structure

```
src/app/
├── core/
│   ├── constants.ts             # App-wide constants (e.g. default currency)
│   └── offer.utils.ts            # sortOffersByVotesDesc() for client re-sort
├── models/
│   └── offer.model.ts            # Offer interface
├── services/
│   └── offer.service.ts          # HTTP service; parseOffer() on GET and PUT responses
├── components/
│   ├── header/                   # Sticky nav header
│   ├── offer-card/               # List item card (presentational)
│   ├── vote-button/              # Reusable vote controls
│   └── purchase-modal/           # Two-state confirmation; resets state when closed
├── directives/
│   └── flip.directive.ts         # FLIP animation for list reorder
├── pages/
│   ├── offer-list/               # Home — sorted offers with voting
│   └── offer-detail/             # Single offer with purchase flow
├── app.routes.ts                 # Lazy-loaded routes; exports ROUTE_OFFERS_SEGMENT, ROUTE_PARAM_OFFER_ID
├── app.config.ts                 # Providers (HttpClient, Router)
├── app.ts                        # Root component
├── app.html                      # Root template
└── app.css                       # Root styles
```

## API Endpoints

The base URL is set in `src/environments/environment.ts` (`apiUrl`); point it at your MockAPI.io app or backend.

| Method | Endpoint                          | Purpose      |
|--------|-----------------------------------|--------------|
| GET    | `/offers?sortBy=votes&order=desc` | List offers  |
| GET    | `/offers/:id`                     | Offer detail |
| PUT    | `/offers/:id`                     | Update votes |

## Testing

67 tests across 7 spec files using Angular CLI's Vitest integration (`@angular/build:unit-test`). Zoneless mode is configured in `src/test-setup.ts` via `@analogjs/vitest-angular/setup-testbed` with `setupTestBed({ zoneless: true })`. Tests use `async/await` + `fixture.whenStable()` — no zone.js dependency.

```bash
npx ng test
```

## Deployment

Hosted on Netlify. Tests gate the deploy — a failing test blocks the build.

```toml
[build]
  command = "npx ng test --watch=false && npm run build"
```

## Tech Stack

- Angular 21 (signals, standalone components, `@if`/`@for` control flow)
- Tailwind CSS v4
- MockAPI.io
- Vitest via `@angular/build:unit-test`
- Netlify