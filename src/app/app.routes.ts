import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/offer-list/offer-list.component').then(
        (m) => m.OfferListComponent
      ),
  },
  {
    path: 'offers/:id',
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
