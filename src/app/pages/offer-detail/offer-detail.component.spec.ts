import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, ActivatedRoute } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { OfferDetailComponent } from './offer-detail.component';
import { environment } from '../../../environments/environment';
import { createMockOffer } from '../../../testing/mock-offer';

describe('OfferDetailComponent', () => {
  let component: OfferDetailComponent;
  let fixture: ComponentFixture<OfferDetailComponent>;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/offers`;

  async function setup(routeId: string = '5') {
    await TestBed.configureTestingModule({
      imports: [OfferDetailComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: { get: (key: string) => (key === 'id' ? routeId : null) },
            },
          },
        },
      ],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(OfferDetailComponent);
    component = fixture.componentInstance;
  }

  afterEach(() => {
    httpMock.verify();
  });

  async function flushOffer(offer = createMockOffer(), id = '5') {
    fixture.detectChanges();
    await fixture.whenStable();
    httpMock.expectOne(`${apiUrl}/${id}`).flush(offer);
    fixture.detectChanges();
    await fixture.whenStable();
  }

  it('should create', async () => {
    await setup();
    expect(component).toBeTruthy();
    await flushOffer();
  });

  it('should fetch offer using route param id', async () => {
    await setup('42');
    fixture.detectChanges();

    const req = httpMock.expectOne(`${apiUrl}/42`);
    expect(req.request.method).toBe('GET');
    req.flush(createMockOffer({ id: '42' }));
  });

  it('should show loading skeleton initially', async () => {
    await setup();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.animate-pulse')).toBeTruthy();

    httpMock.expectOne(`${apiUrl}/5`).flush(createMockOffer());
  });

  it('should render offer details after data loads', async () => {
    await setup();
    const offer = createMockOffer({
      id: '5',
      title: 'Amazing Product',
      price: 299.99,
      category: 'Games',
      description: 'An incredible product',
    });
    await flushOffer(offer);

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Amazing Product');
    expect(text).toContain('299.99');
    expect(text).toContain('Games');
    expect(text).toContain('An incredible product');
  });

  it('should hide skeleton after data loads', async () => {
    await setup();
    await flushOffer();

    expect(fixture.nativeElement.querySelector('.animate-pulse')).toBeNull();
  });

  it('should show error state on API failure', async () => {
    await setup();
    fixture.detectChanges();
    await fixture.whenStable();
    httpMock
      .expectOne(`${apiUrl}/5`)
      .flush('Not Found', { status: 404, statusText: 'Not Found' });
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.nativeElement.textContent).toContain('Offer not found');
  });

  it('should render offer image', async () => {
    await setup();
    const offer = createMockOffer({ title: 'Widget' });
    await flushOffer(offer);

    const img = fixture.nativeElement.querySelector('img');
    expect(img?.src).toBe(offer.image);
    expect(img?.alt).toBe('Widget');
  });

  it('should have back to offers link', async () => {
    await setup();
    await flushOffer();

    const backLink = fixture.nativeElement.querySelector('a[href="/"]');
    expect(backLink).toBeTruthy();
    expect(backLink?.textContent).toContain('Back to offers');
  });

  it('should have purchase button', async () => {
    await setup();
    await flushOffer();

    const purchaseButton = Array.from(
      fixture.nativeElement.querySelectorAll('button')
    ).find((b: any) => b.textContent?.trim() === 'Purchase This Offer');
    expect(purchaseButton).toBeTruthy();
  });

  it('should open purchase modal on button click', async () => {
    await setup();
    await flushOffer();

    expect(component.showPurchaseModal()).toBe(false);

    const purchaseButton = Array.from(
      fixture.nativeElement.querySelectorAll('button')
    ).find((b: any) => b.textContent?.trim() === 'Purchase This Offer') as HTMLButtonElement;
    purchaseButton.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.showPurchaseModal()).toBe(true);
  });

  it('should increment votes on upvote', async () => {
    await setup();
    const offer = createMockOffer({ votes: 15 });
    await flushOffer(offer);

    component.onUpvote();

    expect(component.offer()!.votes).toBe(16);

    httpMock.expectOne((r) => r.method === 'PUT').flush({});
  });

  it('should decrement votes on downvote', async () => {
    await setup();
    const offer = createMockOffer({ votes: 15 });
    await flushOffer(offer);

    component.onDownvote();

    expect(component.offer()!.votes).toBe(14);

    httpMock.expectOne((r) => r.method === 'PUT').flush({});
  });

  it('should not allow downvote below 0', async () => {
    await setup();
    const offer = createMockOffer({ votes: 0 });
    await flushOffer(offer);

    component.onDownvote();

    expect(component.offer()!.votes).toBe(0);
    httpMock.expectNone((r) => r.method === 'PUT');
  });

  it('should rollback upvote on API failure', async () => {
    await setup();
    const offer = createMockOffer({ votes: 10 });
    await flushOffer(offer);

    component.onUpvote();
    expect(component.offer()!.votes).toBe(11);

    httpMock
      .expectOne((r) => r.method === 'PUT')
      .flush('Error', { status: 500, statusText: 'Error' });

    expect(component.offer()!.votes).toBe(10);
  });

  it('should display created date', async () => {
    await setup();
    const offer = createMockOffer({ createdAt: '2026-01-15T00:00:00.000Z' });
    await flushOffer(offer);

    expect(fixture.nativeElement.textContent).toContain('Jan 15, 2026');
  });
});
