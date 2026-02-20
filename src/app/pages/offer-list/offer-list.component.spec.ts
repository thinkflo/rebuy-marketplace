import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { OfferListComponent } from './offer-list.component';
import { environment } from '../../../environments/environment';
import { createMockOffer, createMockOffers } from '../../../testing/mock-offer';

describe('OfferListComponent', () => {
  let component: OfferListComponent;
  let fixture: ComponentFixture<OfferListComponent>;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/offers`;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfferListComponent],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(OfferListComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    httpMock.verify();
  });

  async function flushOffers(offers = createMockOffers(3)) {
    fixture.detectChanges();
    await fixture.whenStable();
    httpMock.expectOne((r) => r.url === apiUrl).flush(offers);
    fixture.detectChanges();
    await fixture.whenStable();
  }

  it('should create', async () => {
    expect(component).toBeTruthy();
    await flushOffers();
  });

  it('should show loading skeleton initially', () => {
    fixture.detectChanges();

    const skeletons = fixture.nativeElement.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBe(3);

    httpMock.expectOne((r) => r.url === apiUrl).flush([]);
  });

  it('should render offer cards after data loads', async () => {
    await flushOffers(createMockOffers(3));

    const cards = fixture.nativeElement.querySelectorAll('app-offer-card');
    expect(cards.length).toBe(3);
  });

  it('should hide skeleton after data loads', async () => {
    await flushOffers();

    const skeletons = fixture.nativeElement.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBe(0);
  });

  it('should show error state on API failure', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    httpMock
      .expectOne((r) => r.url === apiUrl)
      .flush('Server Error', { status: 500, statusText: 'Internal Server Error' });
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.nativeElement.textContent).toContain('Failed to load offers');
  });

  it('should show empty state when no offers returned', async () => {
    await flushOffers([]);

    expect(fixture.nativeElement.textContent).toContain('No offers found');
  });

  it('should show retry button on error', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    httpMock
      .expectOne((r) => r.url === apiUrl)
      .flush('Error', { status: 500, statusText: 'Error' });
    fixture.detectChanges();
    await fixture.whenStable();

    const retryButton = fixture.nativeElement.querySelector('button');
    expect(retryButton?.textContent?.trim()).toBe('Try again');
  });

  it('should increment votes on upvote', async () => {
    await flushOffers();

    const initialVotes = component.offers()[0].votes;
    component.onUpvote(component.offers()[0]);

    expect(component.offers()[0].votes).toBe(initialVotes + 1);

    httpMock.expectOne((r) => r.method === 'PUT').flush({});
  });

  it('should decrement votes on downvote', async () => {
    await flushOffers();

    const initialVotes = component.offers()[0].votes;
    component.onDownvote(component.offers()[0]);

    expect(component.offers()[0].votes).toBe(initialVotes - 1);

    httpMock.expectOne((r) => r.method === 'PUT').flush({});
  });

  it('should not allow downvote below 0', async () => {
    await flushOffers([createMockOffer({ votes: 0 })]);

    component.onDownvote(component.offers()[0]);

    expect(component.offers()[0].votes).toBe(0);
    httpMock.expectNone((r) => r.method === 'PUT');
  });

  it('should re-sort list after upvote', async () => {
    await flushOffers([
      createMockOffer({ id: '1', title: 'First', votes: 10 }),
      createMockOffer({ id: '2', title: 'Second', votes: 9 }),
    ]);

    // Upvote Second twice: 9 → 10 → 11, overtakes First at 10
    const secondOffer = component.offers()[1];
    component.onUpvote(secondOffer);
    httpMock.expectOne((r) => r.method === 'PUT').flush({});
    component.onUpvote(secondOffer);

    expect(component.offers()[0].title).toBe('Second');
    expect(component.offers()[1].title).toBe('First');

    httpMock.expectOne((r) => r.method === 'PUT').flush({});
  });

  it('should rollback upvote on API failure', async () => {
    await flushOffers([createMockOffer({ votes: 10 })]);

    component.onUpvote(component.offers()[0]);
    expect(component.offers()[0].votes).toBe(11);

    httpMock
      .expectOne((r) => r.method === 'PUT')
      .flush('Error', { status: 500, statusText: 'Error' });

    expect(component.offers()[0].votes).toBe(10);
  });

  it('should rollback downvote on API failure', async () => {
    await flushOffers([createMockOffer({ votes: 10 })]);

    component.onDownvote(component.offers()[0]);
    expect(component.offers()[0].votes).toBe(9);

    httpMock
      .expectOne((r) => r.method === 'PUT')
      .flush('Error', { status: 500, statusText: 'Error' });

    expect(component.offers()[0].votes).toBe(10);
  });

  it('should display page heading', async () => {
    await flushOffers([]);

    expect(fixture.nativeElement.textContent).toContain('Top Offers');
  });
});
