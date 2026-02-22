import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Offer } from '../models/offer.model';
import { environment } from '../../environments/environment';

/** API may return price/votes as strings; we coerce to number for the app model. */
type RawOffer = Omit<Offer, 'price' | 'votes'> & {
  price?: string | number;
  votes?: string | number;
};

const SORT_BY_VOTES = 'votes';
const ORDER_DESC = 'desc';

@Injectable({
  providedIn: 'root',
})
export class OfferService {
  private readonly apiUrl = `${environment.apiUrl}/offers`;

  constructor(private http: HttpClient) {}

  private parseOffer(offer: RawOffer): Offer {
    return {
      ...offer,
      price: Number(offer.price),
      votes: Number(offer.votes),
    };
  }

  getOffers(): Observable<Offer[]> {
    return this.http
      .get<RawOffer[]>(this.apiUrl, {
        params: { sortBy: SORT_BY_VOTES, order: ORDER_DESC },
      })
      .pipe(map((offers) => offers.map((o) => this.parseOffer(o))));
  }

  getOffer(id: string): Observable<Offer> {
    return this.http
      .get<RawOffer>(`${this.apiUrl}/${id}`)
      .pipe(map((o) => this.parseOffer(o)));
  }

  updateOffer(offer: Offer): Observable<Offer> {
    return this.http
      .put<RawOffer>(`${this.apiUrl}/${offer.id}`, offer)
      .pipe(map((o) => this.parseOffer(o)));
  }

  upvote(offer: Offer): Observable<Offer> {
    return this.updateOffer(offer);
  }

  downvote(offer: Offer): Observable<Offer> {
    return this.updateOffer(offer);
  }
}
