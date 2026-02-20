import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { OfferService } from './offer.service';
import { environment } from '../../environments/environment';
import { createMockOffer } from '../../testing/mock-offer';

describe('OfferService', () => {
  let service: OfferService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/offers`;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [OfferService, provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    service = TestBed.inject(OfferService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getOffers', () => {
    it('should make GET request with sort params', () => {
      service.getOffers().subscribe();

      const req = httpMock.expectOne(
        (r) =>
          r.url === apiUrl &&
          r.params.get('sortBy') === 'votes' &&
          r.params.get('order') === 'desc'
      );
      expect(req.request.method).toBe('GET');
      req.flush([createMockOffer()]);
    });

    it('should parse string price to number', () => {
      service.getOffers().subscribe((offers) => {
        expect(offers[0].price).toBe(49.95);
        expect(typeof offers[0].price).toBe('number');
      });

      httpMock.expectOne((r) => r.url === apiUrl).flush([{ ...createMockOffer(), price: '49.95' }]);
    });

    it('should parse string votes to number', () => {
      service.getOffers().subscribe((offers) => {
        expect(offers[0].votes).toBe(100);
        expect(typeof offers[0].votes).toBe('number');
      });

      httpMock.expectOne((r) => r.url === apiUrl).flush([{ ...createMockOffer(), votes: '100' }]);
    });
  });

  describe('getOffer', () => {
    it('should make GET request to correct URL', () => {
      service.getOffer('42').subscribe();

      const req = httpMock.expectOne(`${apiUrl}/42`);
      expect(req.request.method).toBe('GET');
      req.flush(createMockOffer({ id: '42' }));
    });

    it('should parse response fields', () => {
      service.getOffer('5').subscribe((offer) => {
        expect(offer.price).toBe(200);
        expect(offer.votes).toBe(55);
      });

      httpMock
        .expectOne(`${apiUrl}/5`)
        .flush({ ...createMockOffer({ id: '5' }), price: '200', votes: '55' });
    });
  });

  describe('updateOffer', () => {
    it('should make PUT request with offer data', () => {
      const offer = createMockOffer({ id: '3', votes: 15 });
      service.updateOffer(offer).subscribe();

      const req = httpMock.expectOne(`${apiUrl}/3`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(offer);
      req.flush(offer);
    });
  });

  describe('upvote', () => {
    it('should send the offer as-is via PUT', () => {
      const offer = createMockOffer({ id: '1', votes: 11 });
      service.upvote(offer).subscribe();

      const req = httpMock.expectOne(`${apiUrl}/1`);
      expect(req.request.body.votes).toBe(11);
      req.flush(offer);
    });
  });

  describe('downvote', () => {
    it('should send the offer as-is via PUT', () => {
      const offer = createMockOffer({ id: '2', votes: 9 });
      service.downvote(offer).subscribe();

      const req = httpMock.expectOne(`${apiUrl}/2`);
      expect(req.request.body.votes).toBe(9);
      req.flush(offer);
    });
  });
});
