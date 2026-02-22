import { Routes } from '@angular/router';

/** Path segment for offer list and detail routes. Use with routerLink: ['/', ROUTE_OFFERS_SEGMENT, id]. */
export const ROUTE_OFFERS_SEGMENT = 'offers';

/** Route param name for offer id in offer detail. */
export const ROUTE_PARAM_OFFER_ID = 'id';

/** Route path for offer detail. Param name is ROUTE_PARAM_OFFER_ID. */
export const ROUTE_OFFER_DETAIL_PATH = `${ROUTE_OFFERS_SEGMENT}/:${ROUTE_PARAM_OFFER_ID}`;

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/offer-list/offer-list.component').then(
        (m) => m.OfferListComponent
      ),
  },
  {
    path: ROUTE_OFFER_DETAIL_PATH,
    loadComponent: () =>
      import('./pages/offer-detail/offer-detail.component').then(
        (m) => m.OfferDetailComponent
      ),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
