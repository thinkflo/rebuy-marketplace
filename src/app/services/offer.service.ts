import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Offer } from '../models/offer.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OfferService {
  private readonly apiUrl = `${environment.apiUrl}/offers`;

  constructor(private http: HttpClient) {}

  private parseOffer(offer: any): Offer {
    return {
      ...offer,
      price: Number(offer.price),
      votes: Number(offer.votes),
    };
  }

  getOffers(): Observable<Offer[]> {
    return this.http
      .get<any[]>(this.apiUrl, {
        params: { sortBy: 'votes', order: 'desc' },
      })
      .pipe(map((offers) => offers.map((o) => this.parseOffer(o))));
  }

  getOffer(id: string): Observable<Offer> {
    return this.http
      .get<any>(`${this.apiUrl}/${id}`)
      .pipe(map((o) => this.parseOffer(o)));
  }

  updateOffer(offer: Offer): Observable<Offer> {
    return this.http.put<Offer>(`${this.apiUrl}/${offer.id}`, offer);
  }

  upvote(offer: Offer): Observable<Offer> {
    return this.updateOffer(offer);
  }

  downvote(offer: Offer): Observable<Offer> {
    return this.updateOffer(offer);
  }
}
