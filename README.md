# rebuy Marketplace OfferBoard MVP

A community-driven offers platform built with **Angular 21** and **Tailwind CSS v4**, using **MockAPI.io** as the backend.

## Features

- Browse all offers sorted by community votes
- View detailed offer pages
- Upvote / downvote offers (optimistic updates with rollback)
- Purchase offers via modal flow
- Responsive design (mobile-first)
- Lazy-loaded routes
- Flip Animation for real-time resorting

## Setup

### 1. Run

```bash
npm install
ng serve
```

Open [http://localhost:4200](http://localhost:4200)

## Project Structure

```
src/app/
├── models/
│   └── offer.model.ts          # Offer interface
├── services/
│   └── offer.service.ts        # MockAPI HTTP service
├── components/
│   ├── header/                 # Sticky nav header
│   ├── offer-card/             # List item card
│   ├── vote-button/            # Reusable vote controls
│   └── purchase-modal/         # Purchase confirmation modal
├── pages/
│   ├── offer-list/             # Home page — all offers sorted by votes
│   └── offer-detail/           # Single offer view with purchase
├── app.routes.ts               # Client-side routing (lazy loaded)
├── app.config.ts               # App providers (HttpClient, Router)
└── app.ts                      # Root component
```

## API Endpoints Used

| Method | Endpoint                              | Purpose        |
|--------|---------------------------------------|----------------|
| GET    | `/offers?sortBy=votes&order=desc`     | List offers     |
| GET    | `/offers/:id`                         | Offer detail    |
| PUT    | `/offers/:id`                         | Update votes    |

## Tech Stack

- Angular 21 (standalone components, control flow syntax)
- Tailwind CSS v4
- MockAPI.io (REST backend)
- TypeScript
